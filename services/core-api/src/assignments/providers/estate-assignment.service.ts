import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstateAssignmentDto } from '../dtos/estate-assignment/createEstateAssignmentDto';
import { Estate } from 'src/estates/estate.entity';
import { Employee } from 'src/employees/employee.entity';
import { EstateAssignment } from '../entities/estate-assignment.entity';
import { UpdateEstateAssignmentDto } from '../dtos/estate-assignment/updateEstateAssignmentDto';

@Injectable()
export class EstateAssignmentService {
  constructor(
    @InjectRepository(EstateAssignment)
    private readonly estateAssignementRepository: Repository<EstateAssignment>,

    @InjectRepository(Estate)
    private readonly estateRepository: Repository<Estate>,

    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  public async createAssignment(
    createEstateAssignmentDto: CreateEstateAssignmentDto,
  ) {
    const estate = await this.estateRepository.findOne({
      where: { id: createEstateAssignmentDto.estateId },
    });

    if (!estate) throw new NotFoundException('estate not found');

    const employee = await this.employeesRepository.findOne({
      where: { id: createEstateAssignmentDto.employeeId },
    });

    if (!employee) throw new NotFoundException('employee not found');

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
  ) {
    const assignment = await this.estateAssignementRepository.findOne({
      where: { id },
    });

    if (!assignment) throw new NotFoundException('assignment not found');

    if (updateEstateAssignmentDto.estateId) {
      const estate = await this.estateRepository.findOne({
        where: { id: updateEstateAssignmentDto.estateId },
      });

      if (!estate) throw new NotFoundException('estate not found');

      assignment.estate = estate;
    }

    if (updateEstateAssignmentDto.employeeId) {
      const employee = await this.employeesRepository.findOne({
        where: { id: updateEstateAssignmentDto.employeeId },
      });

      if (!employee) throw new NotFoundException('employee not found');

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

  public async findAllAssignments() {
    return this.estateAssignementRepository.find();
  }

  public async findAssignmentById(id: string) {
    const assignment = await this.estateAssignementRepository.findOne({
      where: { id },
    });

    if (!assignment) throw new NotFoundException('assignment not found');

    return assignment;
  }

  public async removeAssignment(id: string) {
    const assignment = await this.estateAssignementRepository.findOne({
      where: { id },
    });

    if (!assignment) throw new NotFoundException('assignment not found');

    await this.estateAssignementRepository.remove(assignment);
    return { message: 'assignment deleted successfully' };
  }
}
