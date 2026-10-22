import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerAssignment } from '../entities/worker-assignment.entity';
import { Estate } from 'src/estates/estate.entity';
import { Employee } from 'src/employees/employee.entity';
import { CreateWorkerAssignmentDto } from '../dtos/worker-assignment/createWorkerAssignmentDto';
import { UpdateWorkerAssignmentDto } from '../dtos/worker-assignment/updateWorkerAssignmentDto';

@Injectable()
export class WorkerAssignmentService {
  constructor(
    @InjectRepository(WorkerAssignment)
    private readonly workerAssignmentRepository: Repository<WorkerAssignment>,

    @InjectRepository(Estate)
    private readonly estateRepository: Repository<Estate>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  public async createAssignment(dto: CreateWorkerAssignmentDto) {
    const estate = await this.estateRepository.findOne({
      where: { id: dto.estateId },
    });

    if (!estate) {
      throw new NotFoundException('Estate not found');
    }

    const worker = await this.employeeRepository.findOne({
      where: { id: dto.workerId },
    });

    if (!worker) {
      throw new NotFoundException('Employee not found');
    }

    let supervisor: Employee | null = null;

    if (dto.superVisorId) {
      supervisor = await this.employeeRepository.findOne({
        where: { id: dto.superVisorId },
      });

      if (!supervisor) {
        throw new NotFoundException('Supervisor not found');
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

  public async updateAssignment(id: string, dto: UpdateWorkerAssignmentDto) {
    const assignment = await this.workerAssignmentRepository.findOne({
      where: { id },
    });

    if (!assignment) throw new NotFoundException('assignment not found');

    if (dto.estateId !== undefined) {
      const estate = await this.estateRepository.findOne({
        where: { id: dto.estateId },
      });

      if (!estate) {
        throw new NotFoundException('Estate not found');
      }

      assignment.estate = estate;
    }

    if (dto.workerId !== undefined) {
      const worker = await this.employeeRepository.findOne({
        where: { id: dto.workerId },
      });

      if (!worker) {
        throw new NotFoundException('Employee not found');
      }

      assignment.worker = worker;
    }

    if (dto.superVisorId !== undefined) {
      if (dto.superVisorId === null) {
        assignment.supervisor = null;
      } else {
        const supervisor = await this.employeeRepository.findOne({
          where: { id: dto.superVisorId },
        });

        if (!supervisor) {
          throw new NotFoundException('Supervisor not found');
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

  public async findAllAssignments() {
    return await this.workerAssignmentRepository.find();
  }

  public async findAssignmentById(id: string) {
    const assignment = await this.workerAssignmentRepository.findOne({
      where: { id },
    });

    if (!assignment) throw new NotFoundException('assignment not found');

    return assignment;
  }

  public async deleteAssignment(id: string) {
    const assignment = await this.workerAssignmentRepository.findOne({
      where: { id },
    });

    if (!assignment) throw new NotFoundException('assignment not found');

    await this.workerAssignmentRepository.remove(assignment);

    return { message: 'Worker assignment deleted successfully' };
  }
}
