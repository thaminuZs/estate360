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
import { CreateEstateAssignmentDto } from './dtos/estate-assignment/createEstateAssignmentDto';
import { EstateAssignmentService } from './providers/estate-assignment.service';
import { UpdateEstateAssignmentDto } from './dtos/estate-assignment/updateEstateAssignmentDto';
import { CreateWorkerAssignmentDto } from './dtos/worker-assignment/createWorkerAssignmentDto';
import { UpdateWorkerAssignmentDto } from './dtos/worker-assignment/updateWorkerAssignmentDto';
import { WorkerAssignmentService } from './providers/worker-assignment.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role as AuthRole } from 'src/auth/enums/role.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('assignments')
@UseGuards(AuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(
    private readonly estateAssignmentService: EstateAssignmentService,
    private readonly workerAssignmentService: WorkerAssignmentService,
  ) {}

  // Estate
  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Post('/estate')
  public createEstateAssignment(
    @Body() createEstateAssignmentDto: CreateEstateAssignmentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.estateAssignmentService.createAssignment(
      createEstateAssignmentDto,
      user,
    );
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Patch('/estate/:id')
  public updateEstateAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstateAssignmentDto: UpdateEstateAssignmentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.estateAssignmentService.updateAssignment(
      id,
      updateEstateAssignmentDto,
      user,
    );
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Get('/estate')
  public getAllEstateAssignments(@ActiveUser() user: ActiveUserData) {
    return this.estateAssignmentService.findAllAssignments(user);
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Get('/estate/:id')
  public getEstateAssignmentById(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.estateAssignmentService.findAssignmentById(id, user);
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Delete('/estate/:id')
  public deleteEstateAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.estateAssignmentService.removeAssignment(id, user);
  }

  // Worker
  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Post('/worker')
  public createWorkerAssignment(
    @Body() createWorkerAssignmentDto: CreateWorkerAssignmentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.workerAssignmentService.createAssignment(
      createWorkerAssignmentDto,
      user,
    );
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Patch('/worker/:id')
  public updateWorkerAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkerAssignmentDto: UpdateWorkerAssignmentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.workerAssignmentService.updateAssignment(
      id,
      updateWorkerAssignmentDto,
      user,
    );
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Get('/worker')
  public getAllWorkerAssignments(@ActiveUser() user: ActiveUserData) {
    return this.workerAssignmentService.findAllAssignments(user);
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Get('/worker/:id')
  public getWorkerAssignmentById(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.workerAssignmentService.findAssignmentById(id, user);
  }

  @Roles(AuthRole.ADMIN, AuthRole.OWNER)
  @Delete('/worker/:id')
  public deleteWorkerAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.workerAssignmentService.deleteAssignment(id, user);
  }
}
