import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionRecord } from '../production-record.entity';
import { CreateProductionRecordDto } from '../dtos/create-production-record.dto';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkSession } from 'src/work-sessions/work-session.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(ProductionRecord)
    private readonly productionRepo: Repository<ProductionRecord>,

    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,

    @InjectRepository(Estate)
    private readonly estatesRepo: Repository<Estate>,

    @InjectRepository(WorkSession)
    private readonly sessionsRepo: Repository<WorkSession>,
  ) {}

  public async create(dto: CreateProductionRecordDto, user?: ActiveUserData) {
    const [worker, estate, workSession] = await Promise.all([
      this.employeesRepo.findOne({
        where: { id: dto.workerId },
        relations: { owner: true },
      }),
      this.estatesRepo.findOne({
        where: { id: dto.estateId },
        relations: { owner: true },
      }),
      this.sessionsRepo.findOne({
        where: { id: dto.workSessionId },
        relations: { estate: { owner: true } },
      }),
    ]);

    if (!worker) throw new NotFoundException('Worker not found');
    if (!estate) throw new NotFoundException('Estate not found');
    if (!workSession) throw new NotFoundException('Work session not found');

    if (user?.role === Role.OWNER) {
      if (!user.ownerId || estate.owner?.id !== user.ownerId) {
        throw new ForbiddenException(
          'You do not have access to record production for this estate',
        );
      }
      if (worker.owner && worker.owner.id !== user.ownerId) {
        throw new ForbiddenException('You do not have access to this worker');
      }
      if (workSession.estate?.owner?.id !== user.ownerId) {
        throw new ForbiddenException(
          'You do not have access to this work session',
        );
      }
    }

    const record = this.productionRepo.create({
      worker,
      estate,
      workSession,
      quantity: dto.quantity,
      unit: dto.unit,
      recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
    });

    return this.productionRepo.save(record);
  }

  public async findAll(
    filter?: {
      workerId?: string;
      estateId?: string;
      workSessionId?: string;
    },
    user?: ActiveUserData,
  ) {
    const query = this.productionRepo
      .createQueryBuilder('production')
      .leftJoinAndSelect('production.worker', 'worker')
      .leftJoinAndSelect('production.estate', 'estate')
      .leftJoinAndSelect('production.workSession', 'workSession')
      .orderBy('production.createdAt', 'DESC');

    if (user?.role === Role.OWNER) {
      if (!user.ownerId) return [];
      query.andWhere('estate.owner_id = :ownerId', { ownerId: user.ownerId });
    }

    if (filter?.workerId) {
      query.andWhere('production.worker_id = :workerId', {
        workerId: filter.workerId,
      });
    }
    if (filter?.estateId) {
      query.andWhere('production.estate_id = :estateId', {
        estateId: filter.estateId,
      });
    }
    if (filter?.workSessionId) {
      query.andWhere('production.work_session_id = :workSessionId', {
        workSessionId: filter.workSessionId,
      });
    }

    return query.getMany();
  }
}
