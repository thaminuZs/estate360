import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkSession } from './work-session.entity';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkSessionsService } from './providers/work-sessions.service';
import { WorkSessionsController } from './work-sessions.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkSession, Employee, Estate]),
    AuthModule,
  ],
  controllers: [WorkSessionsController],
  providers: [WorkSessionsService],
  exports: [WorkSessionsService],
})
export class WorkSessionsModule {}
