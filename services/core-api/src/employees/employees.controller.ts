import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/createEmployeeDto';
import { EmployeesService } from './providers/employees.service';
import { PatchEmployeeDto } from './dtos/patchEmployeeDto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('employees')
@UseGuards(AuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(Role.ADMIN, Role.OWNER)
  @Post()
  public create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.employeesService.createEmployee(createEmployeeDto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Patch('/:id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patchEmployeeDto: PatchEmployeeDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.employeesService.updateEmployee(id, patchEmployeeDto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findAll(@ActiveUser() user: ActiveUserData) {
    return this.employeesService.findAllEmployees(user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('/:id')
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.employeesService.findOneEmployee(id, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Delete('/:id')
  public remove(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.employeesService.deleteEmployee(id, user);
  }
}
