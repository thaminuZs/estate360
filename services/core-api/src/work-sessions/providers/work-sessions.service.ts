import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkSession } from '../work-session.entity';
import {
  CreateWorkSessionDto,
  EndWorkSessionDto,
} from '../dtos/work-session.dto';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { Role } from 'src/auth/enums/role.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class WorkSessionsService {
  constructor(
    @InjectRepository(WorkSession)
    private readonly sessionsRepository: Repository<WorkSession>,

    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,

    @InjectRepository(Estate)
    private readonly estatesRepository: Repository<Estate>,
  ) {}

  public async startSession(
    createDto: CreateWorkSessionDto,
    user?: ActiveUserData,
  ) {
    const [worker, estate] = await Promise.all([
      this.employeesRepository.findOne({
        where: { id: createDto.workerId },
        relations: { owner: true },
      }),
      this.estatesRepository.findOne({
        where: { id: createDto.estateId },
        relations: { owner: true },
      }),
    ]);

    if (!worker) throw new NotFoundException('Worker not found');
    if (!estate) throw new NotFoundException('Estate not found');

    if (user && user.role === Role.OWNER) {
      if (estate.owner?.id !== user.ownerId) {
        throw new ForbiddenException(
          'You can only start work sessions in your own estates',
        );
      }
      if (worker.owner && worker.owner.id !== user.ownerId) {
        throw new ForbiddenException(
          'You cannot start a session for another owner’s worker',
        );
      }
    }

    const session = this.sessionsRepository.create({
      worker,
      estate,
      startTime: createDto.startTime
        ? new Date(createDto.startTime)
        : new Date(),
      status: createDto.status ?? 'active',
    });

    return this.sessionsRepository.save(session);
  }

  public async endSession(
    id: string,
    endDto: EndWorkSessionDto,
    user?: ActiveUserData,
  ) {
    const session = await this.findOne(id, user);

    session.endTime = endDto.endTime ? new Date(endDto.endTime) : new Date();
    session.status = endDto.status ?? 'completed';

    return this.sessionsRepository.save(session);
  }

  public async findAll(
    filter?: {
      workerId?: string;
      estateId?: string;
      status?: string;
    },
    user?: ActiveUserData,
  ) {
    const query = this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.worker', 'worker')
      .leftJoinAndSelect('session.estate', 'estate')
      .orderBy('session.startTime', 'DESC');

    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      query.andWhere('estate.owner_id = :ownerId', { ownerId: user.ownerId });
    }

    if (filter?.workerId) {
      query.andWhere('session.worker_id = :workerId', {
        workerId: filter.workerId,
      });
    }
    if (filter?.estateId) {
      query.andWhere('session.estate_id = :estateId', {
        estateId: filter.estateId,
      });
    }
    if (filter?.status) {
      query.andWhere('session.status = :status', { status: filter.status });
    }

    return query.getMany();
  }

  public async findOne(id: string, user?: ActiveUserData) {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: { worker: true, estate: { owner: true } },
    });
    if (!session) {
      throw new NotFoundException(`Work session with ID ${id} not found`);
    }

    if (
      user &&
      user.role === Role.OWNER &&
      session.estate?.owner?.id !== user.ownerId
    ) {
      throw new ForbiddenException(
        'You do not have access to this work session',
      );
    }

    return session;
  }
}
