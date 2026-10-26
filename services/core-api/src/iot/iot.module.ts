import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceAssignment } from './entities/device-assignment.entity';
import { WorkerIotReading } from './entities/worker-iot-reading.entity';
import { EnvironmentIotReading } from './entities/environment-iot-reading.entity';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkSession } from 'src/work-sessions/work-session.entity';
import { IotService } from './providers/iot.service';
import { IotCloudFetchService } from './providers/iot-cloud-fetch.service';
import { IotController } from './iot.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Device,
      DeviceAssignment,
      WorkerIotReading,
      EnvironmentIotReading,
      Employee,
      Estate,
      WorkSession,
    ]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [IotController],
  providers: [IotService, IotCloudFetchService],
  exports: [IotService, IotCloudFetchService],
})
export class IotModule {}
