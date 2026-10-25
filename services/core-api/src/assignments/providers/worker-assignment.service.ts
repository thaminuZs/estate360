import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerAssignment } from '../entities/worker-assignment.entity';
import { Estate } from 'src/estates/estate.entity';
import { Employee } from 'src/employees/employee.entity';
import { CreateWorkerAssignmentDto } from '../dtos/worker-assignment/createWorkerAssignmentDto';
import { UpdateWorkerAssignmentDto } from '../dtos/worker-assignment/updateWorkerAssignmentDto';
import { Role as AuthRole } from 'src/auth/enums/role.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class WorkerAssignmentService implements OnModuleInit {
  constructor(
    @InjectRepository(WorkerAssignment)
    private readonly workerAssignmentRepository: Repository<WorkerAssignment>,

    @InjectRepository(Estate)
    private readonly estateRepository: Repository<Estate>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async onModuleInit() {
    try {
      await this.workerAssignmentRepository.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worker_assignment' AND column_name='employee_id') THEN
            UPDATE "worker_assignment" SET "worker_id" = "employee_id" WHERE "worker_id" IS NULL;
          END IF;
        END $$;
      `);
    } catch {
      // Safe catch
    }
  }

  public async createAssignment(
    dto: CreateWorkerAssignmentDto,
    user?: ActiveUserData,
  ) {
    const estate = await this.estateRepository.findOne({
      where: { id: dto.estateId },
      relations: { owner: true },
    });

    if (!estate) {
      throw new NotFoundException('Estate not found');
    }

    if (
      user &&
      user.role === AuthRole.OWNER &&
      estate.owner?.id !== user.ownerId
    ) {
      throw new ForbiddenException(
        'You can only assign workers to your own estates',
      );
    }

    const worker = await this.employeeRepository.findOne({
      where: { id: dto.workerId },
      relations: { owner: true },
    });

    if (!worker) {
      throw new NotFoundException('Employee not found');
    }

    if (
      user &&
      user.role === AuthRole.OWNER &&
      worker.owner &&
      worker.owner.id !== user.ownerId
    ) {
      throw new ForbiddenException(
        'You cannot assign a worker belonging to another owner',
      );
    }

    let supervisor: Employee | null = null;
    const supervisorId = dto.supervisorId ?? dto.superVisorId;

    if (supervisorId) {
      supervisor = await this.employeeRepository.findOne({
        where: { id: supervisorId },
        relations: { owner: true },
      });

      if (!supervisor) {
        throw new NotFoundException('Supervisor not found');
      }

      if (
        user &&
        user.role === AuthRole.OWNER &&
        supervisor.owner &&
        supervisor.owner.id !== user.ownerId
      ) {
        throw new ForbiddenException(
          'You cannot assign a supervisor belonging to another owner',
        );
      }
    }

    const assignment = this.workerAssignmentRepository.create({
      estate,
      worker,
      supervisor,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    return this.workerAssignmentRepository.save(assignment);
  }

  public async updateAssignment(
    id: string,
    dto: UpdateWorkerAssignmentDto,
    user?: ActiveUserData,
  ) {
    const assignment = await this.findAssignmentById(id, user);

    if (dto.estateId !== undefined) {
      const estate = await this.estateRepository.findOne({
        where: { id: dto.estateId },
        relations: { owner: true },
      });

      if (!estate) {
        throw new NotFoundException('Estate not found');
      }

      if (
        user &&
        user.role === AuthRole.OWNER &&
        estate.owner?.id !== user.ownerId
      ) {
        throw new ForbiddenException(
          'You can only assign workers to your own estates',
        );
      }

      assignment.estate = estate;
    }

    if (dto.workerId !== undefined) {
      const worker = await this.employeeRepository.findOne({
        where: { id: dto.workerId },
        relations: { owner: true },
      });

      if (!worker) {
        throw new NotFoundException('Employee not found');
      }

      if (
        user &&
        user.role === AuthRole.OWNER &&
        worker.owner &&
        worker.owner.id !== user.ownerId
      ) {
        throw new ForbiddenException(
          'You cannot assign a worker belonging to another owner',
        );
      }

      assignment.worker = worker;
    }

    const updatedSupervisorId =
      dto.supervisorId !== undefined ? dto.supervisorId : dto.superVisorId;

    if (updatedSupervisorId !== undefined) {
      if (updatedSupervisorId === null) {
        assignment.supervisor = null;
      } else {
        const supervisor = await this.employeeRepository.findOne({
          where: { id: updatedSupervisorId },
          relations: { owner: true },
        });

        if (!supervisor) {
          throw new NotFoundException('Supervisor not found');
        }

        if (
          user &&
          user.role === AuthRole.OWNER &&
          supervisor.owner &&
          supervisor.owner.id !== user.ownerId
        ) {
          throw new ForbiddenException(
            'You cannot assign a supervisor belonging to another owner',
          );
        }

        assignment.supervisor = supervisor;
      }
    }

    if (dto.startDate !== undefined) {
      assignment.startDate = dto.startDate;
    }

    if (dto.endDate !== undefined) {
      assignment.endDate = dto.endDate;
    }

    return this.workerAssignmentRepository.save(assignment);
  }

  public async findAllAssignments(user?: ActiveUserData) {
    if (user && user.role === AuthRole.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      return this.workerAssignmentRepository.find({
        where: { estate: { owner: { id: user.ownerId } } },
        relations: { estate: true, worker: true, supervisor: true },
      });
    }

    return this.workerAssignmentRepository.find({
      relations: { estate: true, worker: true, supervisor: true },
    });
  }

  public async findAssignmentById(id: string, user?: ActiveUserData) {
    const assignment = await this.workerAssignmentRepository.findOne({
      where: { id },
      relations: { estate: { owner: true }, worker: true, supervisor: true },
    });

    if (!assignment) throw new NotFoundException('assignment not found');

    if (
      user &&
      user.role === AuthRole.OWNER &&
      assignment.estate?.owner?.id !== user.ownerId
    ) {
      throw new ForbiddenException('You do not have access to this assignment');
    }

    return assignment;
  }

  public async deleteAssignment(id: string, user?: ActiveUserData) {
    const assignment = await this.findAssignmentById(id, user);

    await this.workerAssignmentRepository.remove(assignment);

    return { message: 'Worker assignment deleted successfully' };
  }
}
