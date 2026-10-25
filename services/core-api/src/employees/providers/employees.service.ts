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
import { EmployeeStatus } from '../enums/employee-status.enum';
import { Owner } from 'src/owners/owner.entity';
import { Estate } from 'src/estates/estate.entity';
import { EstateAssignment } from 'src/assignments/entities/estate-assignment.entity';
import { Role as AssignmentRole } from 'src/assignments/enums/role.enum';
import { Role } from 'src/auth/enums/role.enum';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,

    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,

    @InjectRepository(Estate)
    private readonly estatesRepository: Repository<Estate>,

    @InjectRepository(EstateAssignment)
    private readonly estateAssignmentsRepository: Repository<EstateAssignment>,
  ) {}

  public async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    user?: ActiveUserData,
  ) {
    const normalizedCode = createEmployeeDto.employeeCode.trim().toUpperCase();
    const normalizedNic = createEmployeeDto.nic.trim().toUpperCase();

    const existing = await this.employeesRepository.findOne({
      where: [
        { employeeCode: normalizedCode },
        { nic: normalizedNic },
      ],
    });

    if (existing) {
      if (existing.employeeCode === normalizedCode) {
        throw new ConflictException(
          `Employee code "${normalizedCode}" is already in use`,
        );
      }
      throw new ConflictException(
        `An employee with NIC "${normalizedNic}" already exists`,
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

    const normalizedRole =
      createEmployeeDto.role?.toLowerCase() === 'supervisor'
        ? 'supervisor'
        : 'worker';

    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      employeeCode: normalizedCode,
      nic: normalizedNic,
      role: normalizedRole,
      status: createEmployeeDto.status ?? EmployeeStatus.ACTIVE,
      owner,
      dateOfBirth: createEmployeeDto.dateOfBirth ?? createEmployeeDto.dob,
    });

    const savedEmployee = await this.employeesRepository.save(employee);

    if (createEmployeeDto.estateId) {
      const estate = await this.estatesRepository.findOne({
        where: { id: createEmployeeDto.estateId },
        relations: { owner: true },
      });

      if (!estate) {
        throw new NotFoundException('Assigned estate not found');
      }

      if (
        user &&
        user.role === Role.OWNER &&
        estate.owner?.id !== user.ownerId
      ) {
        throw new ForbiddenException(
          'You can only assign employees to your own estates',
        );
      }

      const assignmentRole =
        normalizedRole === 'supervisor'
          ? AssignmentRole.SUPERVISOR
          : AssignmentRole.WORKER;

      const assignment = this.estateAssignmentsRepository.create({
        estate,
        employee: savedEmployee,
        role: assignmentRole,
        startDate: createEmployeeDto.dateJoined ?? new Date(),
      });

      await this.estateAssignmentsRepository.save(assignment);
    }

    return this.findOneEmployee(savedEmployee.id, user);
  }

  public async updateEmployee(
    id: string,
    patchEmployeeDto: PatchEmployeeDto,
    user?: ActiveUserData,
  ) {
    const employee = await this.findOneEmployee(id, user);

    if (patchEmployeeDto.employeeCode) {
      employee.employeeCode = patchEmployeeDto.employeeCode.trim().toUpperCase();
    }
    if (patchEmployeeDto.nic) {
      employee.nic = patchEmployeeDto.nic.trim().toUpperCase();
    }
    if (patchEmployeeDto.firstName) {
      employee.firstName = patchEmployeeDto.firstName.trim();
    }
    if (patchEmployeeDto.lastName !== undefined) {
      employee.lastName = patchEmployeeDto.lastName?.trim() || undefined;
    }
    if (patchEmployeeDto.phone !== undefined) {
      employee.phone = patchEmployeeDto.phone?.trim() || undefined;
    }
    if (patchEmployeeDto.address !== undefined) {
      employee.address = patchEmployeeDto.address?.trim() || undefined;
    }
    if (patchEmployeeDto.role !== undefined) {
      employee.role =
        patchEmployeeDto.role.toLowerCase() === 'supervisor'
          ? 'supervisor'
          : 'worker';
    }
    if (patchEmployeeDto.status !== undefined) {
      employee.status = patchEmployeeDto.status;
    }
    if (
      patchEmployeeDto.dateOfBirth !== undefined ||
      patchEmployeeDto.dob !== undefined
    ) {
      employee.dateOfBirth =
        patchEmployeeDto.dateOfBirth ?? patchEmployeeDto.dob;
    }
    if (patchEmployeeDto.dateJoined !== undefined) {
      employee.dateJoined = patchEmployeeDto.dateJoined;
    }

    const saved = await this.employeesRepository.save(employee);

    if (patchEmployeeDto.estateId) {
      const estate = await this.estatesRepository.findOne({
        where: { id: patchEmployeeDto.estateId },
        relations: { owner: true },
      });

      if (!estate) {
        throw new NotFoundException('Estate not found');
      }

      if (
        user &&
        user.role === Role.OWNER &&
        estate.owner?.id !== user.ownerId
      ) {
        throw new ForbiddenException(
          'You can only assign employees to your own estates',
        );
      }

      // Check if an existing estate assignment exists
      let existingAssignment = await this.estateAssignmentsRepository.findOne({
        where: { employee: { id: saved.id }, estate: { id: estate.id } },
      });

      const assignmentRole =
        (saved.role || 'worker') === 'supervisor'
          ? AssignmentRole.SUPERVISOR
          : AssignmentRole.WORKER;

      if (existingAssignment) {
        existingAssignment.role = assignmentRole;
        await this.estateAssignmentsRepository.save(existingAssignment);
      } else {
        const newAssignment = this.estateAssignmentsRepository.create({
          estate,
          employee: saved,
          role: assignmentRole,
          startDate: saved.dateJoined ?? new Date(),
        });
        await this.estateAssignmentsRepository.save(newAssignment);
      }
    }

    return this.findOneEmployee(saved.id, user);
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
        .leftJoinAndSelect('employee.estateAssignments', 'ea')
        .leftJoinAndSelect('ea.estate', 'eaEstate')
        .leftJoinAndSelect('employee.workerAssignments', 'wa')
        .leftJoinAndSelect('wa.estate', 'waEstate')
        .where(
          '(employee.owner_id = :ownerId OR eaEstate.owner_id = :ownerId OR waEstate.owner_id = :ownerId)',
          { ownerId: user.ownerId },
        )
        .orderBy('employee.createdAt', 'DESC')
        .getMany();
    }

    return this.employeesRepository.find({
      relations: {
        owner: true,
        estateAssignments: { estate: true },
        workerAssignments: { estate: true },
      },
      order: { createdAt: 'DESC' },
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

    try {
      await this.employeesRepository.query(
        'DELETE FROM "estate_assignment" WHERE "employee_id" = $1',
        [employee.id],
      );
      await this.employeesRepository.query(
        'DELETE FROM "worker_assignment" WHERE "worker_id" = $1 OR "supervisor_id" = $1',
        [employee.id],
      );
    } catch {
      // Safe catch
    }

    await this.employeesRepository.remove(employee);

    return { message: 'employee deleted successfully' };
  }
}
