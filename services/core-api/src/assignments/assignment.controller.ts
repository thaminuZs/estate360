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
import { CreateEstateAssignmentDto } from './dtos/estate-assignment/createEstateAssignmentDto';
import { EstateAssignmentService } from './providers/estate-assignment.service';
import { UpdateEstateAssignmentDto } from './dtos/estate-assignment/updateEstateAssignmentDto';
import { CreateWorkerAssignmentDto } from './dtos/worker-assignment/createWorkerAssignmentDto';
import { WorkerAssignmentService } from './providers/worker-assignment.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(
    @Inject() private readonly estateAssignmentService: EstateAssignmentService,

    @Inject() private readonly workerAssignmentService: WorkerAssignmentService,
  ) {}

  //Estate
  @Post('/estate')
  public createEstateAssignment(
    @Body() createEstateAssignmentDto: CreateEstateAssignmentDto,
  ) {
    return this.estateAssignmentService.createAssignment(
      createEstateAssignmentDto,
    );
  }

  @Patch('/estate/:id')
  public updateEstateAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstateAssignmentDto: UpdateEstateAssignmentDto,
  ) {
    return this.estateAssignmentService.updateAssignment(
      id,
      updateEstateAssignmentDto,
    );
  }

  @Get('/estate')
  public getAllEstateAssignments() {
    return this.estateAssignmentService.findAllAssignments();
  }

  @Get('/estate/:id')
  public getEstateAssignmentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.estateAssignmentService.findAssignmentById(id);
  }

  @Delete('/estate/:id')
  public deleteEstateAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.estateAssignmentService.removeAssignment(id);
  }

  //Worker
  @Post('/worker')
  public createWorkerAssignment(
    @Body() createWorkerAssignmentDto: CreateWorkerAssignmentDto,
  ) {
    return this.workerAssignmentService.createAssignment(
      createWorkerAssignmentDto,
    );
  }

  @Patch('/worker/:id')
  public updateWorkerAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstateAssignmentDto: UpdateEstateAssignmentDto,
  ) {
    return this.workerAssignmentService.updateAssignment(
      id,
      updateEstateAssignmentDto,
    );
  }

  @Get('/worker')
  public getAllWorkerAssignments() {
    return this.workerAssignmentService.findAllAssignments();
  }

  @Get('/worker/:id')
  public getWorkerAssignmentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.workerAssignmentService.findAssignmentById(id);
  }
}
