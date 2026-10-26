import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entities/device.entity';
import { DeviceAssignment } from '../entities/device-assignment.entity';
import { WorkerIotReading } from '../entities/worker-iot-reading.entity';
import { EnvironmentIotReading } from '../entities/environment-iot-reading.entity';
import { CreateDeviceDto } from '../dtos/create-device.dto';
import { CreateDeviceAssignmentDto } from '../dtos/create-device-assignment.dto';
import { CreateWorkerReadingDto } from '../dtos/create-worker-reading.dto';
import { CreateEnvironmentReadingDto } from '../dtos/create-environment-reading.dto';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkSession } from 'src/work-sessions/work-session.entity';
import { Role } from 'src/auth/enums/role.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class IotService {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,

    @InjectRepository(DeviceAssignment)
    private readonly assignmentsRepository: Repository<DeviceAssignment>,

    @InjectRepository(WorkerIotReading)
    private readonly workerReadingsRepository: Repository<WorkerIotReading>,

    @InjectRepository(EnvironmentIotReading)
    private readonly envReadingsRepository: Repository<EnvironmentIotReading>,

    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,

    @InjectRepository(Estate)
    private readonly estatesRepository: Repository<Estate>,

    @InjectRepository(WorkSession)
    private readonly workSessionsRepository: Repository<WorkSession>,
  ) {}

  public async verifyEstateOwnership(estateId: string, user?: ActiveUserData) {
    const estate = await this.estatesRepository.findOne({
      where: { id: estateId },
      relations: { owner: true },
    });
    if (!estate) {
      throw new NotFoundException('Estate not found');
    }
    if (user && user.role === Role.OWNER && estate.owner?.id !== user.ownerId) {
      throw new ForbiddenException('You do not have access to this estate');
    }
    return estate;
  }

  public async createDevice(createDto: CreateDeviceDto) {
    const device = this.devicesRepository.create(createDto);
    return this.devicesRepository.save(device);
  }

  public async findAllDevices(user?: ActiveUserData) {
    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      return this.devicesRepository
        .createQueryBuilder('device')
        .innerJoin('device.assignments', 'assignment')
        .innerJoin('assignment.estate', 'estate')
        .where('estate.owner_id = :ownerId', { ownerId: user.ownerId })
        .distinct(true)
        .getMany();
    }

    return this.devicesRepository.find();
  }

  public async findDeviceById(id: string, user?: ActiveUserData) {
    const device = await this.devicesRepository.findOne({
      where: { id },
      relations: { assignments: { estate: { owner: true } } },
    });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    if (user && user.role === Role.OWNER) {
      const hasAccess = (device.assignments ?? []).some(
        (a) => a.estate?.owner?.id === user.ownerId,
      );
      if (!hasAccess) {
        throw new ForbiddenException('You do not have access to this device');
      }
    }

    return device;
  }

  public async createAssignment(
    createDto: CreateDeviceAssignmentDto,
    user?: ActiveUserData,
  ) {
    const [device, estate] = await Promise.all([
      this.devicesRepository.findOne({ where: { id: createDto.deviceId } }),
      this.estatesRepository.findOne({
        where: { id: createDto.estateId },
        relations: { owner: true },
      }),
    ]);

    if (!device) throw new NotFoundException('Device not found');
    if (!estate) throw new NotFoundException('Estate not found');

    if (user && user.role === Role.OWNER && estate.owner?.id !== user.ownerId) {
      throw new ForbiddenException(
        'You can only assign devices to your own estates',
      );
    }

    let worker: Employee | null = null;
    if (createDto.workerId) {
      worker = await this.employeesRepository.findOne({
        where: { id: createDto.workerId },
        relations: { owner: true },
      });
      if (!worker) throw new NotFoundException('Worker not found');

      if (
        user &&
        user.role === Role.OWNER &&
        worker.owner &&
        worker.owner.id !== user.ownerId
      ) {
        throw new ForbiddenException(
          'You cannot assign a device to another owner’s worker',
        );
      }
    }

    const assignment = this.assignmentsRepository.create({
      device,
      worker,
      estate,
      startDate: new Date(createDto.startDate),
      endDate: createDto.endDate ? new Date(createDto.endDate) : undefined,
    });

    return this.assignmentsRepository.save(assignment);
  }

  public async findAllAssignments(user?: ActiveUserData) {
    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      return this.assignmentsRepository.find({
        where: { estate: { owner: { id: user.ownerId } } },
        relations: { device: true, worker: true, estate: true },
      });
    }

    return this.assignmentsRepository.find({
      relations: { device: true, worker: true, estate: true },
    });
  }

  public async createWorkerReading(
    dto: CreateWorkerReadingDto,
    user?: ActiveUserData,
  ) {
    const [device, worker, estate, workSession] = await Promise.all([
      this.devicesRepository.findOne({ where: { id: dto.deviceId } }),
      this.employeesRepository.findOne({ where: { id: dto.workerId } }),
      this.estatesRepository.findOne({
        where: { id: dto.estateId },
        relations: { owner: true },
      }),
      this.workSessionsRepository.findOne({ where: { id: dto.workSessionId } }),
    ]);

    if (!device) throw new NotFoundException('Device not found');
    if (!worker) throw new NotFoundException('Worker not found');
    if (!estate) throw new NotFoundException('Estate not found');
    if (!workSession) throw new NotFoundException('WorkSession not found');

    if (user && user.role === Role.OWNER && estate.owner?.id !== user.ownerId) {
      throw new ForbiddenException(
        'You can only record readings for your own estates',
      );
    }

    const reading = this.workerReadingsRepository.create({
      device,
      worker,
      estate,
      workSession,
      recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
      activityStatus: dto.activityStatus ?? 'active',
      location: dto.location
        ? {
            type: 'Point',
            coordinates: [dto.location.longitude, dto.location.latitude],
          }
        : undefined,
    });

    return this.workerReadingsRepository.save(reading);
  }

  public async findWorkerReadings(
    filter?: {
      estateId?: string;
      workerId?: string;
      sessionId?: string;
      limit?: number;
    },
    user?: ActiveUserData,
  ) {
    if (filter?.estateId && user?.role === Role.OWNER) {
      await this.verifyEstateOwnership(filter.estateId, user);
    }

    const query = this.workerReadingsRepository
      .createQueryBuilder('reading')
      .leftJoinAndSelect('reading.device', 'device')
      .leftJoinAndSelect('reading.worker', 'worker')
      .leftJoinAndSelect('reading.estate', 'estate')
      .leftJoinAndSelect('reading.workSession', 'workSession')
      .orderBy('reading.recordedAt', 'DESC')
      .take(filter?.limit ?? 50);

    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      query.andWhere('estate.owner_id = :ownerId', { ownerId: user.ownerId });
    }

    if (filter?.estateId) {
      query.andWhere('reading.estate_id = :estateId', {
        estateId: filter.estateId,
      });
    }
    if (filter?.workerId) {
      query.andWhere('reading.worker_id = :workerId', {
        workerId: filter.workerId,
      });
    }
    if (filter?.sessionId) {
      query.andWhere('reading.work_session_id = :sessionId', {
        sessionId: filter.sessionId,
      });
    }

    return query.getMany();
  }

  public async createEnvironmentReading(
    dto: CreateEnvironmentReadingDto,
    user?: ActiveUserData,
  ) {
    const [device, estate] = await Promise.all([
      this.devicesRepository.findOne({ where: { id: dto.deviceId } }),
      this.estatesRepository.findOne({
        where: { id: dto.estateId },
        relations: { owner: true },
      }),
    ]);

    if (!device) throw new NotFoundException('Device not found');
    if (!estate) throw new NotFoundException('Estate not found');

    if (user && user.role === Role.OWNER && estate.owner?.id !== user.ownerId) {
      throw new ForbiddenException(
        'You can only record readings for your own estates',
      );
    }

    const reading = this.envReadingsRepository.create({
      device,
      estate,
      recordedAt: new Date(dto.recordedAt),
      temperature: dto.temperature,
      humidity: dto.humidity,
      soilMoisture: dto.soilMoisture,
      location: dto.location
        ? {
            type: 'Point',
            coordinates: [dto.location.longitude, dto.location.latitude],
          }
        : undefined,
    });

    return this.envReadingsRepository.save(reading);
  }

  public async findEnvironmentReadings(
    filter?: {
      estateId?: string;
      deviceId?: string;
      limit?: number;
    },
    user?: ActiveUserData,
  ) {
    if (filter?.estateId && user?.role === Role.OWNER) {
      await this.verifyEstateOwnership(filter.estateId, user);
    }

    const query = this.envReadingsRepository
      .createQueryBuilder('reading')
      .leftJoinAndSelect('reading.device', 'device')
      .leftJoinAndSelect('reading.estate', 'estate')
      .orderBy('reading.recordedAt', 'DESC')
      .take(filter?.limit ?? 50);

    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      query.andWhere('estate.owner_id = :ownerId', { ownerId: user.ownerId });
    }

    if (filter?.estateId) {
      query.andWhere('reading.estate_id = :estateId', {
        estateId: filter.estateId,
      });
    }
    if (filter?.deviceId) {
      query.andWhere('reading.device_id = :deviceId', {
        deviceId: filter.deviceId,
      });
    }

    return query.getMany();
  }
}
