import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dtos/createEmployeeDto';
import { PatchEmployeeDto } from '../dtos/patchEmployeeDto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  public async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeesRepository.create(createEmployeeDto);
    return await this.employeesRepository.save(employee);
  }

  public async updateEmployee(id: string, patchEmployeeDto: PatchEmployeeDto) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('employee not found');

    Object.assign(employee, patchEmployeeDto);

    return await this.employeesRepository.save(employee);
  }

  public async findAllEmployees() {
    return await this.employeesRepository.find();
  }

  public async findOneEmployee(id: string) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('employee not found');

    return employee;
  }

  public async deleteEmployee(id: string) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('employee not found');

    await this.employeesRepository.remove(employee);

    return { message: 'employee deleted successfully' };
  }
}
