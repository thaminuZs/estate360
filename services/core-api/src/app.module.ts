import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnersModule } from './owners/owners.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owners/owner.entity';
import { User } from './auth/entities/users.entity';
import { EstatesModule } from './estates/estates.module';
import { AuthModule } from './auth/auth.module';
import { Estate } from './estates/estate.entity';
import { CropModule } from './crop/crop.module';
import { Crop } from './crop/crop.entity';
import { Employee } from './employees/employee.entity';
import { EmployeesModule } from './employees/employees.module';
import { EstateAssignment } from './assignments/entities/estate-assignment.entity';
import { AssignmentsModule } from './assignments/assignments.module';
import { WorkerAssignment } from './assignments/entities/worker-assignment.entity';

@Module({
  imports: [
    OwnersModule,
    EstatesModule,
    AuthModule,
    CropModule,
    EmployeesModule,
    AssignmentsModule,

    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        entities: [
          Owner,
          User,
          Estate,
          Crop,
          Employee,
          EstateAssignment,
          WorkerAssignment,
        ],
        synchronize: true,
        port: 5432,
        host: 'localhost',
        username: 'postgres',
        password: 'toor',
        database: 'estate360-test',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
