import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstatePayRate } from '../entities/estate-pay-rate.entity';
import { Payroll } from '../entities/payroll.entity';
import { PayrollItem } from '../entities/payroll-item.entity';
import { Payment } from '../entities/payment.entity';
import { CreatePayRateDto } from '../dtos/create-pay-rate.dto';
import { GeneratePayrollDto } from '../dtos/generate-payroll.dto';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { Estate } from 'src/estates/estate.entity';
import { Owner } from 'src/owners/owner.entity';
import { Employee } from 'src/employees/employee.entity';
import { ProductionRecord } from 'src/production/production-record.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(EstatePayRate)
    private readonly payRatesRepo: Repository<EstatePayRate>,

    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,

    @InjectRepository(PayrollItem)
    private readonly payrollItemRepo: Repository<PayrollItem>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Estate)
    private readonly estatesRepo: Repository<Estate>,

    @InjectRepository(Owner)
    private readonly ownersRepo: Repository<Owner>,

    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,

    @InjectRepository(ProductionRecord)
    private readonly productionRepo: Repository<ProductionRecord>,
  ) {}

  // Pay Rates
  public async createPayRate(dto: CreatePayRateDto, user?: ActiveUserData) {
    const estate = await this.estatesRepo.findOne({
      where: { id: dto.estateId },
      relations: { owner: true },
    });
    if (!estate) throw new NotFoundException('Estate not found');

    if (user?.role === Role.OWNER) {
      if (!user.ownerId || estate.owner?.id !== user.ownerId) {
        throw new ForbiddenException(
          'You do not have access to configure pay rates for this estate',
        );
      }
    }

    const payRate = this.payRatesRepo.create({
      estate,
      rate: dto.rate,
      unit: dto.unit,
      paymentFactor: dto.paymentFactor,
      effectiveFrom: new Date(dto.effectiveFrom),
      effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
    });

    return this.payRatesRepo.save(payRate);
  }

  public async findPayRatesByEstate(estateId: string, user?: ActiveUserData) {
    const estate = await this.estatesRepo.findOne({
      where: { id: estateId },
      relations: { owner: true },
    });
    if (!estate) throw new NotFoundException('Estate not found');

    if (user?.role === Role.OWNER) {
      if (!user.ownerId || estate.owner?.id !== user.ownerId) {
        throw new ForbiddenException('You do not have access to this estate');
      }
    }

    return this.payRatesRepo.find({
      where: { estate: { id: estateId } },
      order: { effectiveFrom: 'DESC' },
    });
  }

  // Payroll Generation & Calculation
  public async generatePayroll(dto: GeneratePayrollDto, user?: ActiveUserData) {
    let targetOwnerId = dto.ownerId;

    if (user?.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile not linked to current user',
        );
      }
      if (targetOwnerId && targetOwnerId !== user.ownerId) {
        throw new ForbiddenException(
          'Owners can only generate payroll for their own estates',
        );
      }
      targetOwnerId = user.ownerId;
    }

    if (!targetOwnerId) {
      throw new BadRequestException('ownerId is required');
    }

    const owner = await this.ownersRepo.findOne({
      where: { id: targetOwnerId },
      relations: { estates: true },
    });
    if (!owner) throw new NotFoundException('Owner not found');

    const payroll = this.payrollRepo.create({
      owner,
      periodStart: new Date(dto.periodStart),
      periodEnd: new Date(dto.periodEnd),
      paymentFrequency: dto.paymentFrequency,
      status: 'draft',
    });
    const savedPayroll = await this.payrollRepo.save(payroll);

    // Calculate payroll items across owner's estates
    const estateIds = (owner.estates ?? []).map((e) => e.id);
    const payrollItems: PayrollItem[] = [];

    if (estateIds.length > 0) {
      // Find workers and production records in this period
      const productionRecords = await this.productionRepo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.worker', 'worker')
        .leftJoinAndSelect('p.estate', 'estate')
        .where('p.estate_id IN (:...estateIds)', { estateIds })
        .andWhere('p.created_at >= :start AND p.created_at <= :end', {
          start: new Date(dto.periodStart),
          end: new Date(dto.periodEnd),
        })
        .getMany();

      // Group production by worker and estate
      const map = new Map<
        string,
        { worker: Employee; estate: Estate; totalQuantity: number }
      >();
      for (const rec of productionRecords) {
        const key = `${rec.worker.id}_${rec.estate.id}`;
        if (!map.has(key)) {
          map.set(key, {
            worker: rec.worker,
            estate: rec.estate,
            totalQuantity: 0,
          });
        }
        map.get(key)!.totalQuantity += Number(rec.quantity);
      }

      for (const entry of map.values()) {
        const latestRate = await this.payRatesRepo.findOne({
          where: { estate: { id: entry.estate.id } },
          order: { effectiveFrom: 'DESC' },
        });

        const rate = latestRate ? Number(latestRate.rate) : 10;
        const factor = latestRate ? Number(latestRate.paymentFactor) : 1;
        const productionPay = entry.totalQuantity * rate * factor;
        const basicPay = 500; // standard baseline
        const grossPay = basicPay + productionPay;
        const deductions = Math.round(grossPay * 0.08 * 100) / 100; // e.g. 8% EPF
        const netPay = grossPay - deductions;

        const item = this.payrollItemRepo.create({
          payroll: savedPayroll,
          worker: entry.worker,
          estate: entry.estate,
          basicPay,
          productionPay,
          overtime: 0,
          allowances: 0,
          bonuses: 0,
          grossPay,
          deductions,
          netPay,
        });

        const savedItem = await this.payrollItemRepo.save(item);
        payrollItems.push(savedItem);
      }
    }

    savedPayroll.items = payrollItems;
    return savedPayroll;
  }

  public async findPayrolls(ownerId?: string, user?: ActiveUserData) {
    const query = this.payrollRepo
      .createQueryBuilder('payroll')
      .leftJoinAndSelect('payroll.owner', 'owner')
      .leftJoinAndSelect('payroll.items', 'items')
      .leftJoinAndSelect('items.worker', 'worker')
      .leftJoinAndSelect('items.estate', 'estate')
      .orderBy('payroll.createdAt', 'DESC');

    if (user?.role === Role.OWNER) {
      if (!user.ownerId) return [];
      if (ownerId && ownerId !== user.ownerId) {
        throw new ForbiddenException(
          'You do not have access to another owner payrolls',
        );
      }
      query.andWhere('payroll.owner_id = :ownerId', { ownerId: user.ownerId });
    } else if (ownerId) {
      query.andWhere('payroll.owner_id = :ownerId', { ownerId });
    }

    return query.getMany();
  }

  public async findPayrollById(id: string, user?: ActiveUserData) {
    const payroll = await this.payrollRepo.findOne({
      where: { id },
      relations: {
        owner: true,
        items: { worker: true, estate: true, payment: true },
      },
    });
    if (!payroll) throw new NotFoundException('Payroll not found');

    if (user?.role === Role.OWNER) {
      if (!user.ownerId || payroll.owner?.id !== user.ownerId) {
        throw new ForbiddenException('You do not have access to this payroll');
      }
    }

    return payroll;
  }

  public async processPayroll(id: string, user?: ActiveUserData) {
    const payroll = await this.findPayrollById(id, user);
    payroll.status = 'processed';
    payroll.processedAt = new Date();
    return this.payrollRepo.save(payroll);
  }

  // Payments
  public async createPayment(dto: CreatePaymentDto, user?: ActiveUserData) {
    const item = await this.payrollItemRepo.findOne({
      where: { id: dto.payrollItemId },
      relations: {
        payment: true,
        estate: { owner: true },
        payroll: { owner: true },
      },
    });
    if (!item) throw new NotFoundException('Payroll item not found');

    if (user?.role === Role.OWNER) {
      const itemOwnerId = item.estate?.owner?.id ?? item.payroll?.owner?.id;
      if (!user.ownerId || itemOwnerId !== user.ownerId) {
        throw new ForbiddenException(
          'You do not have access to create a payment for this payroll item',
        );
      }
    }

    const payment = this.paymentRepo.create({
      payrollItem: item,
      amount: dto.amount,
      paymentDate: new Date(dto.paymentDate),
      bankName: dto.bankName,
      accountNumber: dto.accountNumber,
      accountName: dto.accountName,
      transactionReference: dto.transactionReference,
      status: dto.status ?? 'completed',
    });

    return this.paymentRepo.save(payment);
  }

  public async findPayments(user?: ActiveUserData) {
    if (user?.role === Role.OWNER) {
      if (!user.ownerId) return [];
      return this.paymentRepo.find({
        where: { payrollItem: { estate: { owner: { id: user.ownerId } } } },
        relations: { payrollItem: { worker: true, estate: true } },
      });
    }

    return this.paymentRepo.find({
      relations: { payrollItem: { worker: true, estate: true } },
    });
  }
}
