import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstateAssignmentDto } from '../dtos/estate-assignment/createEstateAssignmentDto';
import { Estate } from 'src/estates/estate.entity';
import { Employee } from 'src/employees/employee.entity';
import { EstateAssignment } from '../entities/estate-assignment.entity';
import { UpdateEstateAssignmentDto } from '../dtos/estate-assignment/updateEstateAssignmentDto';
import { Role as AuthRole } from 'src/auth/enums/role.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class EstateAssignmentService implements OnModuleInit {
  constructor(
    @InjectRepository(EstateAssignment)
    private readonly estateAssignementRepository: Repository<EstateAssignment>,

    @InjectRepository(Estate)
    private readonly estateRepository: Repository<Estate>,

    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async onModuleInit() {
    try {
      await this.estateAssignementRepository.query(
        `UPDATE "estate_assignment" SET "role" = 'supervisor' WHERE "role" IS NULL`,
      );
    } catch {
      // Safe catch if database/table not ready yet
    }
  }

  public async createAssignment(
    createEstateAssignmentDto: CreateEstateAssignmentDto,
    user?: ActiveUserData,
  ) {
    const estate = await this.estateRepository.findOne({
      where: { id: createEstateAssignmentDto.estateId },
      relations: { owner: true },
    });

    if (!estate) throw new NotFoundException('estate not found');

    if (
      user &&
      user.role === AuthRole.OWNER &&
      estate.owner?.id !== user.ownerId
    ) {
      throw new ForbiddenException(
        'You can only assign employees to your own estates',
      );
    }

    const employee = await this.employeesRepository.findOne({
      where: { id: createEstateAssignmentDto.employeeId },
      relations: { owner: true },
    });

    if (!employee) throw new NotFoundException('employee not found');

    if (
      user &&
      user.role === AuthRole.OWNER &&
      employee.owner &&
      employee.owner.id !== user.ownerId
    ) {
      throw new ForbiddenException(
        'You cannot assign an employee belonging to another owner',
      );
    }

    const assignment = this.estateAssignementRepository.create({
      startDate: createEstateAssignmentDto.startDate,
      endDate: createEstateAssignmentDto.endDate,
      estate,
      employee,
      role: createEstateAssignmentDto.role,
    });

    return this.estateAssignementRepository.save(assignment);
  }

  public async updateAssignment(
    id: string,
    updateEstateAssignmentDto: UpdateEstateAssignmentDto,
    user?: ActiveUserData,
  ) {
    const assignment = await this.findAssignmentById(id, user);

    if (updateEstateAssignmentDto.estateId) {
      const estate = await this.estateRepository.findOne({
        where: { id: updateEstateAssignmentDto.estateId },
        relations: { owner: true },
      });

      if (!estate) throw new NotFoundException('estate not found');

      if (
        user &&
        user.role === AuthRole.OWNER &&
        estate.owner?.id !== user.ownerId
      ) {
        throw new ForbiddenException(
          'You can only assign employees to your own estates',
        );
      }

      assignment.estate = estate;
    }

    if (updateEstateAssignmentDto.employeeId) {
      const employee = await this.employeesRepository.findOne({
        where: { id: updateEstateAssignmentDto.employeeId },
        relations: { owner: true },
      });

      if (!employee) throw new NotFoundException('employee not found');

      if (
        user &&
        user.role === AuthRole.OWNER &&
        employee.owner &&
        employee.owner.id !== user.ownerId
      ) {
        throw new ForbiddenException(
          'You cannot assign an employee belonging to another owner',
        );
      }

      assignment.employee = employee;
    }

    if (updateEstateAssignmentDto.role !== undefined) {
      assignment.role = updateEstateAssignmentDto.role;
    }

    if (updateEstateAssignmentDto.endDate !== undefined) {
      assignment.endDate = updateEstateAssignmentDto.endDate;
    }

    if (updateEstateAssignmentDto.startDate !== undefined) {
      assignment.startDate = updateEstateAssignmentDto.startDate;
    }

    return this.estateAssignementRepository.save(assignment);
  }

  public async findAllAssignments(user?: ActiveUserData) {
    if (user && user.role === AuthRole.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      return this.estateAssignementRepository.find({
        where: { estate: { owner: { id: user.ownerId } } },
        relations: { estate: true, employee: true },
      });
    }

    return this.estateAssignementRepository.find({
      relations: { estate: true, employee: true },
    });
  }

  public async findAssignmentById(id: string, user?: ActiveUserData) {
    const assignment = await this.estateAssignementRepository.findOne({
      where: { id },
      relations: { estate: { owner: true }, employee: true },
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

  public async removeAssignment(id: string, user?: ActiveUserData) {
    const assignment = await this.findAssignmentById(id, user);

    await this.estateAssignementRepository.remove(assignment);
    return { message: 'assignment deleted successfully' };
  }
}
