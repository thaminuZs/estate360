import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { WorkerIotReading } from '../entities/worker-iot-reading.entity';
import { EnvironmentIotReading } from '../entities/environment-iot-reading.entity';
import { Device } from '../entities/device.entity';
import { DeviceAssignment } from '../entities/device-assignment.entity';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkSession } from 'src/work-sessions/work-session.entity';
import { ConfigureIotCloudDto } from '../dtos/configure-iot-cloud.dto';

export interface CloudWorkerReadingPayload {
  rawMessage?: string;
  deviceCode?: string;
  deviceId?: string;
  workerId?: string;
  estateId?: string;
  workSessionId?: string;
  recordedAt?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  activityStatus?: string;
}

export interface CloudEnvReadingPayload {
  deviceCode?: string;
  deviceId?: string;
  estateId?: string;
  recordedAt?: string;
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

@Injectable()
export class IotCloudFetchService {
  private readonly logger = new Logger(IotCloudFetchService.name);

  private apiUrl: string;
  private apiKey: string;
  private workerReadingsPath: string;
  private environmentReadingsPath: string;
  private isEnabled: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(WorkerIotReading)
    private readonly workerReadingsRepo: Repository<WorkerIotReading>,
    @InjectRepository(EnvironmentIotReading)
    private readonly envReadingsRepo: Repository<EnvironmentIotReading>,
    @InjectRepository(Device)
    private readonly devicesRepo: Repository<Device>,
    @InjectRepository(DeviceAssignment)
    private readonly assignmentsRepo: Repository<DeviceAssignment>,
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
    @InjectRepository(Estate)
    private readonly estatesRepo: Repository<Estate>,
    @InjectRepository(WorkSession)
    private readonly workSessionsRepo: Repository<WorkSession>,
  ) {
    this.apiUrl =
      this.configService.get<string>('IOT_CLOUD_API_URL') ??
      'https://api.estate360-cloud.com';
    this.apiKey = this.configService.get<string>('IOT_CLOUD_API_KEY') ?? '';
    this.workerReadingsPath =
      this.configService.get<string>('IOT_CLOUD_WORKER_PATH') ??
      '/readings/workers';
    this.environmentReadingsPath =
      this.configService.get<string>('IOT_CLOUD_ENV_PATH') ??
      '/readings/environment';
    this.isEnabled =
      this.configService.get<string>('IOT_CLOUD_FETCH_ENABLED') !== 'false';
  }

  public getConfig() {
    return {
      apiUrl: this.apiUrl,
      apiKeyConfigured: Boolean(this.apiKey),
      workerReadingsPath: this.workerReadingsPath,
      environmentReadingsPath: this.environmentReadingsPath,
      enabled: this.isEnabled,
      fullWorkerUrl: `${this.apiUrl}${this.workerReadingsPath}`,
      fullEnvUrl: `${this.apiUrl}${this.environmentReadingsPath}`,
    };
  }

  public updateConfig(newConfig: ConfigureIotCloudDto) {
    if (newConfig.apiUrl !== undefined) {
      this.apiUrl = newConfig.apiUrl.replace(/\/+$/, '');
    }
    if (newConfig.apiKey !== undefined) {
      this.apiKey = newConfig.apiKey;
    }
    if (newConfig.workerReadingsPath !== undefined) {
      this.workerReadingsPath = newConfig.workerReadingsPath.startsWith('/')
        ? newConfig.workerReadingsPath
        : `/${newConfig.workerReadingsPath}`;
    }
    if (newConfig.environmentReadingsPath !== undefined) {
      this.environmentReadingsPath =
        newConfig.environmentReadingsPath.startsWith('/')
          ? newConfig.environmentReadingsPath
          : `/${newConfig.environmentReadingsPath}`;
    }
    if (newConfig.enabled !== undefined) {
      this.isEnabled = newConfig.enabled;
    }

    this.logger.log(`IoT Cloud Fetch configuration updated: ${this.apiUrl}`);
    return this.getConfig();
  }

  /**
   * Parses LoRa string format from worker_device.ino:
   * WORKER|<DEVICE_UUID>|LAT=6.927100|LON=79.861200|ALT=12.50|STATUS=ACTIVE
   */
  public parseRawLoRaWorkerPacket(
    raw: string,
  ): CloudWorkerReadingPayload | null {
    const parts = raw.trim().split('|');
    if (parts.length < 3 || parts[0] !== 'WORKER') {
      return null;
    }

    const deviceIdentifier = parts[1];
    let lat: number | undefined;
    let lon: number | undefined;
    let activityStatus = 'UNKNOWN';

    for (let i = 2; i < parts.length; i++) {
      const [key, val] = parts[i].split('=');
      if (key === 'LAT' && val && val !== 'INVALID') {
        const parsed = parseFloat(val);
        if (!Number.isNaN(parsed)) lat = parsed;
      } else if (key === 'LON' && val && val !== 'INVALID') {
        const parsed = parseFloat(val);
        if (!Number.isNaN(parsed)) lon = parsed;
      } else if (key === 'STATUS' && val) {
        activityStatus = val;
      }
    }

    return {
      deviceId: deviceIdentifier,
      deviceCode: deviceIdentifier,
      activityStatus,
      location:
        lat !== undefined && lon !== undefined
          ? { latitude: lat, longitude: lon }
          : undefined,
    };
  }

  public async fetchAndSyncWorkerReadings(filter?: {
    estateId?: string;
    limit?: number;
  }) {
    if (!this.isEnabled) {
      return { status: 'skipped', message: 'Cloud IoT fetching is disabled' };
    }

    const query = new URLSearchParams();
    if (filter?.estateId) query.set('estateId', filter.estateId);
    if (filter?.limit) query.set('limit', String(filter.limit));

    const url = `${this.apiUrl}${this.workerReadingsPath}${query.toString() ? `?${query.toString()}` : ''}`;
    this.logger.log(`Fetching worker readings from: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'X-API-KEY': this.apiKey,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Cloud server responded with status: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as Array<
        CloudWorkerReadingPayload | string
      >;
      const normalizedItems: CloudWorkerReadingPayload[] = [];

      if (Array.isArray(data)) {
        for (const entry of data) {
          if (typeof entry === 'string') {
            const parsed = this.parseRawLoRaWorkerPacket(entry);
            if (parsed) normalizedItems.push(parsed);
          } else if (entry && typeof entry === 'object') {
            if (entry.rawMessage) {
              const parsed = this.parseRawLoRaWorkerPacket(entry.rawMessage);
              if (parsed) normalizedItems.push({ ...parsed, ...entry });
            } else {
              normalizedItems.push(entry);
            }
          }
        }
      }

      const synced = await this.saveWorkerReadings(normalizedItems);

      return {
        status: 'success',
        syncedCount: synced.length,
        items: synced,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch from cloud server';
      this.logger.error(`Error fetching worker readings: ${errorMessage}`);
      return {
        status: 'error',
        message: errorMessage,
      };
    }
  }

  public async fetchAndSyncEnvironmentReadings(filter?: {
    estateId?: string;
    limit?: number;
  }) {
    if (!this.isEnabled) {
      return { status: 'skipped', message: 'Cloud IoT fetching is disabled' };
    }

    const query = new URLSearchParams();
    if (filter?.estateId) query.set('estateId', filter.estateId);
    if (filter?.limit) query.set('limit', String(filter.limit));

    const url = `${this.apiUrl}${this.environmentReadingsPath}${query.toString() ? `?${query.toString()}` : ''}`;
    this.logger.log(`Fetching environment readings from: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'X-API-KEY': this.apiKey,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Cloud server responded with status: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as CloudEnvReadingPayload[];
      const synced = await this.saveEnvReadings(
        Array.isArray(data) ? data : [],
      );

      return {
        status: 'success',
        syncedCount: synced.length,
        items: synced,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch from cloud server';
      this.logger.error(`Error fetching environment readings: ${errorMessage}`);
      return {
        status: 'error',
        message: errorMessage,
      };
    }
  }

  public async syncAll(filter?: { estateId?: string; limit?: number }) {
    const [workerResult, envResult] = await Promise.all([
      this.fetchAndSyncWorkerReadings(filter),
      this.fetchAndSyncEnvironmentReadings(filter),
    ]);

    return {
      timestamp: new Date().toISOString(),
      workerReadings: workerResult,
      environmentReadings: envResult,
    };
  }

  public async saveWorkerReadings(items: CloudWorkerReadingPayload[]) {
    const savedRecords: WorkerIotReading[] = [];

    for (const item of items) {
      let device: Device | null = null;
      if (item.deviceId) {
        device = await this.devicesRepo
          .findOne({ where: { id: item.deviceId } })
          .catch(() => null);
      }
      if (!device && (item.deviceCode || item.deviceId)) {
        device = await this.devicesRepo.findOne({
          where: { deviceCode: item.deviceCode ?? item.deviceId },
        });
      }

      if (!device) continue;

      let worker = item.workerId
        ? await this.employeesRepo.findOne({ where: { id: item.workerId } })
        : null;
      let estate = item.estateId
        ? await this.estatesRepo.findOne({ where: { id: item.estateId } })
        : null;

      // Auto-resolve worker and estate from active DeviceAssignment if not provided in payload
      if (!worker || !estate) {
        const activeAssignment = await this.assignmentsRepo.findOne({
          where: { device: { id: device.id }, endDate: IsNull() },
          relations: { worker: true, estate: true },
        });
        if (activeAssignment) {
          worker = worker ?? activeAssignment.worker ?? null;
          estate = estate ?? activeAssignment.estate ?? null;
        }
      }

      if (!worker || !estate) continue;

      let workSession = item.workSessionId
        ? await this.workSessionsRepo.findOne({
            where: { id: item.workSessionId },
          })
        : null;

      if (!workSession) {
        workSession = await this.workSessionsRepo.findOne({
          where: {
            worker: { id: worker.id },
            estate: { id: estate.id },
            status: 'active',
          },
        });
      }

      const reading = this.workerReadingsRepo.create({
        device,
        worker,
        estate,
        workSession: workSession ?? null,
        recordedAt: item.recordedAt ? new Date(item.recordedAt) : new Date(),
        activityStatus: item.activityStatus ?? 'active',
        location: item.location
          ? {
              type: 'Point',
              coordinates: [item.location.longitude, item.location.latitude],
            }
          : undefined,
      });

      const saved = await this.workerReadingsRepo.save(reading);
      savedRecords.push(saved);
    }

    return savedRecords;
  }

  public async saveEnvReadings(items: CloudEnvReadingPayload[]) {
    const savedRecords: EnvironmentIotReading[] = [];

    for (const item of items) {
      let device: Device | null = null;
      if (item.deviceId) {
        device = await this.devicesRepo
          .findOne({ where: { id: item.deviceId } })
          .catch(() => null);
      }
      if (!device && (item.deviceCode || item.deviceId)) {
        device = await this.devicesRepo.findOne({
          where: { deviceCode: item.deviceCode ?? item.deviceId },
        });
      }

      if (!device) continue;

      let estate = item.estateId
        ? await this.estatesRepo.findOne({ where: { id: item.estateId } })
        : null;

      if (!estate) {
        const activeAssignment = await this.assignmentsRepo.findOne({
          where: { device: { id: device.id }, endDate: IsNull() },
          relations: { estate: true },
        });
        if (activeAssignment) {
          estate = activeAssignment.estate;
        }
      }

      if (device && estate) {
        const reading = this.envReadingsRepo.create({
          device,
          estate,
          recordedAt: item.recordedAt ? new Date(item.recordedAt) : new Date(),
          temperature: item.temperature,
          humidity: item.humidity,
          soilMoisture: item.soilMoisture,
          location: item.location
            ? {
                type: 'Point',
                coordinates: [item.location.longitude, item.location.latitude],
              }
            : undefined,
        });

        const saved = await this.envReadingsRepo.save(reading);
        savedRecords.push(saved);
      }
    }

    return savedRecords;
  }
}
