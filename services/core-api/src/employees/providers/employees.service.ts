import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dtos/createEmployeeDto';
import { PatchEmployeeDto } from '../dtos/patchEmployeeDto';
import { Owner } from 'src/owners/owner.entity';
import { Role } from 'src/auth/enums/role.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,

    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,
  ) {}

  public async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    user?: ActiveUserData,
  ) {
    const existing = await this.employeesRepository.findOne({
      where: [
        { employeeCode: createEmployeeDto.employeeCode },
        { nic: createEmployeeDto.nic },
      ],
    });

    if (existing) {
      throw new ConflictException(
        'An employee with this employee code or NIC already exists',
      );
    }

    let ownerId = createEmployeeDto.ownerId;

    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }
      if (ownerId && ownerId !== user.ownerId) {
        throw new ForbiddenException(
          'You can only create employees under your own owner account',
        );
      }
      ownerId = user.ownerId;
    }

    let owner: Owner | null = null;
    if (ownerId) {
      owner = await this.ownersRepository.findOne({ where: { id: ownerId } });
      if (!owner) {
        throw new NotFoundException('Owner not found');
      }
    }

    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      owner,
      dateOfBirth: createEmployeeDto.dateOfBirth ?? createEmployeeDto.dob,
    });
    return this.employeesRepository.save(employee);
  }

  public async updateEmployee(
    id: string,
    patchEmployeeDto: PatchEmployeeDto,
    user?: ActiveUserData,
  ) {
    const employee = await this.findOneEmployee(id, user);

    Object.assign(employee, patchEmployeeDto);
    if (
      patchEmployeeDto.dateOfBirth !== undefined ||
      patchEmployeeDto.dob !== undefined
    ) {
      employee.dateOfBirth =
        patchEmployeeDto.dateOfBirth ?? patchEmployeeDto.dob;
    }

    return this.employeesRepository.save(employee);
  }

  public async findAllEmployees(user?: ActiveUserData) {
    if (user && user.role === Role.OWNER) {
      if (!user.ownerId) {
        throw new ForbiddenException(
          'Owner profile is not linked to this account',
        );
      }

      return this.employeesRepository
        .createQueryBuilder('employee')
        .leftJoinAndSelect('employee.owner', 'owner')
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

    return this.employeesRepository.find({
      relations: { owner: true },
    });
  }

  public async findOneEmployee(id: string, user?: ActiveUserData) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        estateAssignments: { estate: { owner: true } },
        workerAssignments: { estate: { owner: true } },
      },
    });
    if (!employee) throw new NotFoundException('employee not found');

    if (user && user.role === Role.OWNER) {
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
        throw new ForbiddenException('You do not have access to this employee');
      }
    }

    return employee;
  }

  public async deleteEmployee(id: string, user?: ActiveUserData) {
    const employee = await this.findOneEmployee(id, user);

    await this.employeesRepository.remove(employee);

    return { message: 'employee deleted successfully' };
  }
}
