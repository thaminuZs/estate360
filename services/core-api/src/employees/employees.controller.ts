import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/createEmployeeDto';
import { EmployeesService } from './providers/employees.service';
import { PatchEmployeeDto } from './dtos/patchEmployeeDto';

@Controller('employees')
export class EmployeesController {
  constructor(@Inject() private readonly employeesService: EmployeesService) {}

  @Post()
  public create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.createEmployee(createEmployeeDto);
  }

  @Patch('/:id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patchEmployeeDto: PatchEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(id, patchEmployeeDto);
  }

  @Get()
  public findAll() {
    return this.employeesService.findAllEmployees();
  }

  @Get('/:id')
  public findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOneEmployee(id);
  }

  @Delete('/:id')
  public remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.deleteEmployee(id);
  }
}
