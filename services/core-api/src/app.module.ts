import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from './auth/auth.module';
import { OwnersModule } from './owners/owners.module';
import { EstatesModule } from './estates/estates.module';
import { CropModule } from './crop/crop.module';
import { EmployeesModule } from './employees/employees.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { PaymentDetailsModule } from './payment-details/payment-details.module';
import { IotModule } from './iot/iot.module';
import { WorkSessionsModule } from './work-sessions/work-sessions.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ProductionModule } from './production/production.module';
import { PayrollModule } from './payroll/payroll.module';

// Entities
import { Owner } from './owners/owner.entity';
import { User } from './auth/entities/users.entity';
import { Estate } from './estates/estate.entity';
import { Crop } from './crop/crop.entity';
import { Employee } from './employees/employee.entity';
import { EstateAssignment } from './assignments/entities/estate-assignment.entity';
import { WorkerAssignment } from './assignments/entities/worker-assignment.entity';
import { EmployeePaymentDetail } from './payment-details/payment-details.entity';
import { Device } from './iot/entities/device.entity';
import { DeviceAssignment } from './iot/entities/device-assignment.entity';
import { WorkerIotReading } from './iot/entities/worker-iot-reading.entity';
import { EnvironmentIotReading } from './iot/entities/environment-iot-reading.entity';
import { WorkSession } from './work-sessions/work-session.entity';
import { Attendance } from './attendance/attendance.entity';
import { ProductionRecord } from './production/production-record.entity';
import { EstatePayRate } from './payroll/entities/estate-pay-rate.entity';
import { Payroll } from './payroll/entities/payroll.entity';
import { PayrollItem } from './payroll/entities/payroll-item.entity';
import { Payment } from './payroll/entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Feature Modules
    AuthModule,
    OwnersModule,
    EstatesModule,
    CropModule,
    EmployeesModule,
    AssignmentsModule,
    PaymentDetailsModule,
    IotModule,
    WorkSessionsModule,
    AttendanceModule,
    ProductionModule,
    PayrollModule,

    // Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        entities: [
          Owner,
          User,
          Estate,
          Crop,
          Employee,
          EstateAssignment,
          WorkerAssignment,
          EmployeePaymentDetail,
          Device,
          DeviceAssignment,
          WorkerIotReading,
          EnvironmentIotReading,
          WorkSession,
          Attendance,
          ProductionRecord,
          EstatePayRate,
          Payroll,
          PayrollItem,
          Payment,
        ],
        synchronize: true,
        port: Number(configService.get<number>('DB_PORT') ?? 5432),
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        username: configService.get<string>('DB_USERNAME') ?? 'postgres',
        password: configService.get<string>('DB_PASSWORD') ?? 'toor',
        database: configService.get<string>('DB_NAME') ?? 'estate360-ai',
      }),
      dataSourceFactory: async (options?: DataSourceOptions) => {
        if (!options) {
          throw new Error('Invalid DataSource options passed');
        }
        const dataSource = new DataSource({
          ...options,
          synchronize: false,
        });
        await dataSource.initialize();

        // Ensure PostGIS extension is available for geometry/geography columns
        try {
          await dataSource.query('CREATE EXTENSION IF NOT EXISTS postgis;');
        } catch {
          // Ignore if extension already exists or cannot be created
        }

        // Backfill any legacy null values before schema synchronization runs
        try {
          await dataSource.query(`
            DO $$
            BEGIN
              IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estate_assignment' AND column_name='role') THEN
                UPDATE "estate_assignment" SET "role" = 'supervisor' WHERE "role" IS NULL;
              END IF;
              IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worker_assignment' AND column_name='employee_id')
                 AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worker_assignment' AND column_name='worker_id') THEN
                UPDATE "worker_assignment" SET "worker_id" = "employee_id" WHERE "worker_id" IS NULL;
              END IF;
              IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='owner' AND column_name='contact_email')
                 AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='owner' AND column_name='email') THEN
                UPDATE "owner" SET "email" = "contact_email" WHERE "email" IS NULL;
              END IF;
            END $$;
          `);
        } catch {
          // Ignore if tables do not exist yet
        }

        if (options.synchronize) {
          await dataSource.synchronize();
        }

        return dataSource;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
