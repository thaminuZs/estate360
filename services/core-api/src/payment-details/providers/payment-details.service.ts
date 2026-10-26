import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeePaymentDetail } from '../payment-details.entity';
import { CreatePaymentDetailDto } from '../dtos/createPaymentDetail.dto';
import { UpdatePaymentDetailDto } from '../dtos/updatePaymentDetail.dto';
import { Employee } from 'src/employees/employee.entity';
import { Role } from 'src/auth/enums/role.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PaymentDetailsService {
  constructor(
    @InjectRepository(EmployeePaymentDetail)
    private readonly paymentDetailsRepository: Repository<EmployeePaymentDetail>,

    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  private verifyEmployeeAccess(employee: Employee, user?: ActiveUserData) {
    if (!user || user.role !== Role.OWNER) {
      return;
    }

    if (!user.ownerId) {
      throw new ForbiddenException(
        'Owner profile is not linked to this account',
      );
    }

    const isDirectOwner = employee.owner?.id === user.ownerId;
    const isAssignedToOwnerEstate =
      (employee.estateAssignments ?? []).some(
        (ea) => ea.estate?.owner?.id === user.ownerId,
      ) ||
      (employee.workerAssignments ?? []).some(
        (wa) => wa.estate?.owner?.id === user.ownerId,
      );

    if (!isDirectOwner && !isAssignedToOwnerEstate) {
      throw new ForbiddenException(
        "You do not have access to this employee's payment details",
      );
    }
  }

  public async create(
    createDto: CreatePaymentDetailDto,
    user?: ActiveUserData,
  ) {
    const employee = await this.employeesRepository.findOne({
      where: { id: createDto.employeeId },
      relations: {
        owner: true,
        estateAssignments: { estate: { owner: true } },
        workerAssignments: { estate: { owner: true } },
      },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createDto.employeeId} not found`,
      );
    }

    this.verifyEmployeeAccess(employee, user);

    const existing = await this.paymentDetailsRepository.findOne({
      where: { employee: { id: createDto.employeeId } },
    });

    if (existing) {
      throw new ConflictException(
        'Payment details already exist for this employee',
      );
    }

    const paymentDetail = this.paymentDetailsRepository.create({
      employee,
      paymentFrequency: createDto.paymentFrequency,
      bankName: createDto.bankName,
      accountNumber: createDto.accountNumber,
      accountName: createDto.accountName,
      branch: createDto.branch,
      isActive: createDto.isActive ?? true,
    });

    return this.paymentDetailsRepository.save(paymentDetail);
  }

  public async findAll(user?: ActiveUserData) {
    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }

      return this.paymentDetailsRepository
        .createQueryBuilder('detail')
        .leftJoinAndSelect('detail.employee', 'employee')
        .leftJoin('employee.estateAssignments', 'ea')
        .leftJoin('ea.estate', 'eaEstate')
        .leftJoin('employee.workerAssignments', 'wa')
        .leftJoin('wa.estate', 'waEstate')
        .where(
          '(employee.owner_id = :ownerId OR eaEstate.owner_id = :ownerId OR waEstate.owner_id = :ownerId)',
          { ownerId: user.ownerId },
        )
        .distinct(true)
        .getMany();
    }

    return this.paymentDetailsRepository.find({
      relations: { employee: true },
    });
  }

  public async findByEmployeeId(employeeId: string, user?: ActiveUserData) {
    const detail = await this.paymentDetailsRepository.findOne({
      where: { employee: { id: employeeId } },
      relations: {
        employee: {
          owner: true,
          estateAssignments: { estate: { owner: true } },
          workerAssignments: { estate: { owner: true } },
        },
      },
    });

    if (!detail) {
      throw new NotFoundException(
        `Payment details for employee ID ${employeeId} not found`,
      );
    }

    this.verifyEmployeeAccess(detail.employee, user);

    return detail;
  }

  public async update(
    id: string,
    updateDto: UpdatePaymentDetailDto,
    user?: ActiveUserData,
  ) {
    const detail = await this.paymentDetailsRepository.findOne({
      where: { id },
      relations: {
        employee: {
          owner: true,
          estateAssignments: { estate: { owner: true } },
          workerAssignments: { estate: { owner: true } },
        },
      },
    });

    if (!detail) {
      throw new NotFoundException(`Payment detail with ID ${id} not found`);
    }

    this.verifyEmployeeAccess(detail.employee, user);

    if (updateDto.paymentFrequency !== undefined) {
      detail.paymentFrequency = updateDto.paymentFrequency;
    }
    if (updateDto.bankName !== undefined) {
      detail.bankName = updateDto.bankName;
    }
    if (updateDto.accountNumber !== undefined) {
      detail.accountNumber = updateDto.accountNumber;
    }
    if (updateDto.accountName !== undefined) {
      detail.accountName = updateDto.accountName;
    }
    if (updateDto.branch !== undefined) {
      detail.branch = updateDto.branch;
    }
    if (updateDto.isActive !== undefined) {
      detail.isActive = updateDto.isActive;
    }

    return this.paymentDetailsRepository.save(detail);
  }
}
