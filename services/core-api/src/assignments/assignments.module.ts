import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstateAssignment } from './entities/estate-assignment.entity';
import { EstateAssignmentService } from './providers/estate-assignment.service';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkerAssignmentService } from './providers/worker-assignment.service';
import { WorkerAssignment } from './entities/worker-assignment.entity';

@Module({
  controllers: [AssignmentsController],
  providers: [EstateAssignmentService, WorkerAssignmentService],
  imports: [
    TypeOrmModule.forFeature([
      EstateAssignment,
      WorkerAssignment,
      Employee,
      Estate,
    ]),
  ],
})
export class AssignmentsModule {}
