import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../attendance.entity';
import {
  CheckInAttendanceDto,
  CheckOutAttendanceDto,
} from '../dtos/attendance.dto';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { Role } from 'src/auth/enums/role.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,

    @InjectRepository(Estate)
    private readonly estatesRepo: Repository<Estate>,
  ) {}

  public async checkIn(dto: CheckInAttendanceDto, user?: ActiveUserData) {
    const [worker, estate] = await Promise.all([
      this.employeesRepo.findOne({
        where: { id: dto.workerId },
        relations: { owner: true },
      }),
      this.estatesRepo.findOne({
        where: { id: dto.estateId },
        relations: { owner: true },
      }),
    ]);

    if (!worker) throw new NotFoundException('Worker not found');
    if (!estate) throw new NotFoundException('Estate not found');

    if (user && user.role === Role.OWNER) {
      if (estate.owner?.id !== user.ownerId) {
        throw new ForbiddenException(
          'You can only record attendance for your own estates',
        );
      }
      if (worker.owner && worker.owner.id !== user.ownerId) {
        throw new ForbiddenException(
          'You cannot record attendance for another owner’s worker',
        );
      }
    }

    const date = dto.date ? new Date(dto.date) : new Date();
    const checkIn = dto.checkIn ? new Date(dto.checkIn) : new Date();

    const attendance = this.attendanceRepo.create({
      worker,
      estate,
      date,
      checkIn,
      status: dto.status ?? 'present',
    });

    return this.attendanceRepo.save(attendance);
  }

  public async checkOut(
    id: string,
    dto: CheckOutAttendanceDto,
    user?: ActiveUserData,
  ) {
    const record = await this.attendanceRepo.findOne({
      where: { id },
      relations: { estate: { owner: true } },
    });
    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    if (
      user &&
      user.role === Role.OWNER &&
      record.estate?.owner?.id !== user.ownerId
    ) {
      throw new ForbiddenException(
        'You do not have access to this attendance record',
      );
    }

    record.checkOut = dto.checkOut ? new Date(dto.checkOut) : new Date();
    if (dto.status) {
      record.status = dto.status;
    }

    return this.attendanceRepo.save(record);
  }

  public async findAll(
    filter?: {
      workerId?: string;
      estateId?: string;
      date?: string;
    },
    user?: ActiveUserData,
  ) {
    const query = this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.worker', 'worker')
      .leftJoinAndSelect('attendance.estate', 'estate')
      .orderBy('attendance.checkIn', 'DESC');

    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      query.andWhere('estate.owner_id = :ownerId', { ownerId: user.ownerId });
    }

    if (filter?.workerId) {
      query.andWhere('attendance.worker_id = :workerId', {
        workerId: filter.workerId,
      });
    }
    if (filter?.estateId) {
      query.andWhere('attendance.estate_id = :estateId', {
        estateId: filter.estateId,
      });
    }
    if (filter?.date) {
      query.andWhere('attendance.date = :date', { date: filter.date });
    }

    return query.getMany();
  }
}
