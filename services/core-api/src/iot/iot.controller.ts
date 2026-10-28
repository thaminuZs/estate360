import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IotService } from './providers/iot.service';
import { IotCloudFetchService } from './providers/iot-cloud-fetch.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { CreateDeviceAssignmentDto } from './dtos/create-device-assignment.dto';
import { CreateWorkerReadingDto } from './dtos/create-worker-reading.dto';
import { CreateEnvironmentReadingDto } from './dtos/create-environment-reading.dto';
import { ConfigureIotCloudDto } from './dtos/configure-iot-cloud.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('iot')
@UseGuards(AuthGuard, RolesGuard)
export class IotController {
  constructor(
    private readonly iotService: IotService,
    private readonly cloudFetchService: IotCloudFetchService,
  ) {}

  // Devices
  @Roles(Role.ADMIN)
  @Post('devices')
  public createDevice(@Body() createDto: CreateDeviceDto) {
    return this.iotService.createDevice(createDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('devices')
  public findAllDevices(@ActiveUser() user: ActiveUserData) {
    return this.iotService.findAllDevices(user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('devices/:id')
  public findDevice(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.iotService.findDeviceById(id, user);
  }

  // Device Assignments
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('assignments')
  public createAssignment(
    @Body() createDto: CreateDeviceAssignmentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.iotService.createAssignment(createDto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('assignments')
  public findAllAssignments(@ActiveUser() user: ActiveUserData) {
    return this.iotService.findAllAssignments(user);
  }

  // IoT Readings (Ingest)
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('readings/worker')
  public createWorkerReading(
    @Body() dto: CreateWorkerReadingDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.iotService.createWorkerReading(dto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('readings/worker')
  public findWorkerReadings(
    @ActiveUser() user: ActiveUserData,
    @Query('estateId') estateId?: string,
    @Query('workerId') workerId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.iotService.findWorkerReadings(
      {
        estateId,
        workerId,
        sessionId,
        limit: limit ? Number(limit) : undefined,
      },
      user,
    );
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('readings/environment')
  public createEnvironmentReading(
    @Body() dto: CreateEnvironmentReadingDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.iotService.createEnvironmentReading(dto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('readings/environment')
  public findEnvironmentReadings(
    @ActiveUser() user: ActiveUserData,
    @Query('estateId') estateId?: string,
    @Query('deviceId') deviceId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.iotService.findEnvironmentReadings(
      {
        estateId,
        deviceId,
        limit: limit ? Number(limit) : undefined,
      },
      user,
    );
  }

  // Cloud Fetch & Integration
  @Roles(Role.ADMIN)
  @Get('cloud/config')
  public getCloudConfig() {
    return this.cloudFetchService.getConfig();
  }

  @Roles(Role.ADMIN)
  @Patch('cloud/config')
  public updateCloudConfig(@Body() configDto: ConfigureIotCloudDto) {
    return this.cloudFetchService.updateConfig(configDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('cloud/sync')
  public async syncAllFromCloud(
    @ActiveUser() user: ActiveUserData,
    @Query('estateId') estateId?: string,
    @Query('limit') limit?: number,
  ) {
    if (estateId) {
      await this.iotService.verifyEstateOwnership(estateId, user);
    }
    return this.cloudFetchService.syncAll({
      estateId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('cloud/sync/worker')
  public async syncWorkerFromCloud(
    @ActiveUser() user: ActiveUserData,
    @Query('estateId') estateId?: string,
    @Query('limit') limit?: number,
  ) {
    if (estateId) {
      await this.iotService.verifyEstateOwnership(estateId, user);
    }
    return this.cloudFetchService.fetchAndSyncWorkerReadings({
      estateId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('cloud/sync/environment')
  public async syncEnvFromCloud(
    @ActiveUser() user: ActiveUserData,
    @Query('estateId') estateId?: string,
    @Query('limit') limit?: number,
  ) {
    if (estateId) {
      await this.iotService.verifyEstateOwnership(estateId, user);
    }
    return this.cloudFetchService.fetchAndSyncEnvironmentReadings({
      estateId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('cloud/sync/production')
  public async syncProductionFromCloud(
    @ActiveUser() user: ActiveUserData,
    @Query('estateId') estateId?: string,
    @Query('workerId') workerId?: string,
    @Query('limit') limit?: number,
  ) {
    if (estateId) {
      await this.iotService.verifyEstateOwnership(estateId, user);
    }
    return this.cloudFetchService.fetchAndSyncProductionReadings({
      estateId,
      workerId,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
