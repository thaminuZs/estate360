import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './providers/employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { Owner } from 'src/owners/owner.entity';
import { Estate } from 'src/estates/estate.entity';
import { EstateAssignment } from 'src/assignments/entities/estate-assignment.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [
    TypeOrmModule.forFeature([Employee, Owner, Estate, EstateAssignment]),
    AuthModule,
  ],
})
export class EmployeesModule {}
