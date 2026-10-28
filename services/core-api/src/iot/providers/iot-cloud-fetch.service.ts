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
import { ProductionRecord } from 'src/production/production-record.entity';
import { WorkerAssignment } from 'src/assignments/entities/worker-assignment.entity';
import { ConfigureIotCloudDto } from '../dtos/configure-iot-cloud.dto';

export interface CloudWorkerReadingPayload {
  rawMessage?: string;
  deviceCode?: string;
  deviceId?: string;
  workerId?: string;
  estateId?: string;
  workSessionId?: string;
  recordedAt?: string;
  altitude?: number;
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  activityStatus?: string;
}

export interface CloudEnvReadingPayload {
  rawMessage?: string;
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

export interface CloudProductionReadingPayload {
  rawMessage?: string;
  deviceCode?: string;
  deviceId?: string;
  workerId?: string;
  employeeCode?: string;
  estateId?: string;
  estateCode?: string;
  workSessionId?: string;
  quantity?: number;
  weight?: number;
  unit?: string;
  recordedAt?: string;
}

@Injectable()
export class IotCloudFetchService {
  private readonly logger = new Logger(IotCloudFetchService.name);

  private apiUrl: string;
  private apiKey: string;
  private workerReadingsPath: string;
  private environmentReadingsPath: string;
  private productionReadingsPath: string;
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
    @InjectRepository(ProductionRecord)
    private readonly productionRepo: Repository<ProductionRecord>,
    @InjectRepository(WorkerAssignment)
    private readonly workerAssignmentsRepo: Repository<WorkerAssignment>,
  ) {
    this.apiUrl =
      this.configService.get<string>('IOT_CLOUD_API_URL') ??
      'http://localhost:8080';
    this.apiKey = this.configService.get<string>('IOT_CLOUD_API_KEY') ?? '';
    this.workerReadingsPath =
      this.configService.get<string>('IOT_CLOUD_WORKER_PATH') ??
      '/readings/workers';
    this.environmentReadingsPath =
      this.configService.get<string>('IOT_CLOUD_ENV_PATH') ??
      '/readings/environment';
    this.productionReadingsPath =
      this.configService.get<string>('IOT_CLOUD_PRODUCTION_PATH') ??
      '/readings/production';
    this.isEnabled =
      this.configService.get<string>('IOT_CLOUD_FETCH_ENABLED') !== 'false';
  }

  public getConfig() {
    return {
      apiUrl: this.apiUrl,
      apiKeyConfigured: Boolean(this.apiKey),
      workerReadingsPath: this.workerReadingsPath,
      environmentReadingsPath: this.environmentReadingsPath,
      productionReadingsPath: this.productionReadingsPath,
      enabled: this.isEnabled,
      fullWorkerUrl: `${this.apiUrl}${this.workerReadingsPath}`,
      fullEnvUrl: `${this.apiUrl}${this.environmentReadingsPath}`,
      fullProductionUrl: `${this.apiUrl}${this.productionReadingsPath}`,
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
    if (newConfig.productionReadingsPath !== undefined) {
      this.productionReadingsPath =
        newConfig.productionReadingsPath.startsWith('/')
          ? newConfig.productionReadingsPath
          : `/${newConfig.productionReadingsPath}`;
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
    let alt: number | undefined;
    let activityStatus = 'UNKNOWN';

    for (let i = 2; i < parts.length; i++) {
      const [key, val] = parts[i].split('=');
      if (key === 'LAT' && val && val !== 'INVALID') {
        const parsed = parseFloat(val);
        if (!Number.isNaN(parsed)) lat = parsed;
      } else if (key === 'LON' && val && val !== 'INVALID') {
        const parsed = parseFloat(val);
        if (!Number.isNaN(parsed)) lon = parsed;
      } else if (key === 'ALT' && val && val !== 'INVALID') {
        const parsed = parseFloat(val);
        if (!Number.isNaN(parsed)) alt = parsed;
      } else if (key === 'STATUS' && val) {
        activityStatus = val;
      }
    }

    return {
      deviceId: deviceIdentifier,
      deviceCode: deviceIdentifier,
      activityStatus,
      altitude: alt,
      location:
        lat !== undefined && lon !== undefined
          ? { latitude: lat, longitude: lon, ...(alt !== undefined ? { altitude: alt } : {}) }
          : undefined,
    };
  }

  /**
   * Parses LoRa string format for environmental sensors:
   * ENV|<DEVICE_CODE>|TEMP=26.50|HUM=78.00|SOIL=44.20|LAT=6.927100|LON=79.861200
   */
  public parseRawLoRaEnvPacket(raw: string): CloudEnvReadingPayload | null {
    const parts = raw.trim().split('|');
    if (parts.length < 3 || parts[0] !== 'ENV') {
      return null;
    }

    const deviceIdentifier = parts[1];
    let temperature: number | undefined;
    let humidity: number | undefined;
    let soilMoisture: number | undefined;
    let lat: number | undefined;
    let lon: number | undefined;

    for (let i = 2; i < parts.length; i++) {
      const [key, val] = parts[i].split('=');
      if (!val || val === 'INVALID') continue;
      const parsed = parseFloat(val);
      if (Number.isNaN(parsed)) continue;

      if (key === 'TEMP') temperature = parsed;
      else if (key === 'HUM') humidity = parsed;
      else if (key === 'SOIL') soilMoisture = parsed;
      else if (key === 'LAT') lat = parsed;
      else if (key === 'LON') lon = parsed;
    }

    return {
      deviceId: deviceIdentifier,
      deviceCode: deviceIdentifier,
      temperature,
      humidity,
      soilMoisture,
      location:
        lat !== undefined && lon !== undefined
          ? { latitude: lat, longitude: lon }
          : undefined,
    };
  }

  /**
   * Parses LoRa string format for smart harvest scale:
   * SCALE|<DEVICE_CODE>|WORKER=EMP-001|WEIGHT=28.50|UNIT=kg|ESTATE=GV-TEA-001
   */
  public parseRawLoRaScalePacket(
    raw: string,
  ): CloudProductionReadingPayload | null {
    const parts = raw.trim().split('|');
    if (parts.length < 3 || (parts[0] !== 'SCALE' && parts[0] !== 'PRODUCTION')) {
      return null;
    }

    const deviceIdentifier = parts[1];
    let workerId: string | undefined;
    let employeeCode: string | undefined;
    let estateId: string | undefined;
    let estateCode: string | undefined;
    let quantity: number | undefined;
    let unit = 'kg';

    for (let i = 2; i < parts.length; i++) {
      const [key, val] = parts[i].split('=');
      if (!val || val === 'INVALID') continue;

      if (key === 'WORKER' || key === 'WORKER_ID') {
        workerId = val;
        employeeCode = val;
      } else if (key === 'ESTATE' || key === 'ESTATE_ID') {
        estateId = val;
        estateCode = val;
      } else if (key === 'WEIGHT' || key === 'QTY' || key === 'QUANTITY') {
        const parsed = parseFloat(val);
        if (!Number.isNaN(parsed)) quantity = parsed;
      } else if (key === 'UNIT') {
        unit = val;
      }
    }

    return {
      deviceId: deviceIdentifier,
      deviceCode: deviceIdentifier,
      workerId,
      employeeCode,
      estateId,
      estateCode,
      quantity,
      unit,
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
              else normalizedItems.push(entry);
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

      const data = (await response.json()) as Array<
        CloudEnvReadingPayload | string
      >;
      const normalizedItems: CloudEnvReadingPayload[] = [];

      if (Array.isArray(data)) {
        for (const entry of data) {
          if (typeof entry === 'string') {
            const parsed = this.parseRawLoRaEnvPacket(entry);
            if (parsed) normalizedItems.push(parsed);
          } else if (entry && typeof entry === 'object') {
            if (entry.rawMessage) {
              const parsed = this.parseRawLoRaEnvPacket(entry.rawMessage);
              if (parsed) normalizedItems.push({ ...parsed, ...entry });
              else normalizedItems.push(entry);
            } else {
              normalizedItems.push(entry);
            }
          }
        }
      }

      const synced = await this.saveEnvReadings(normalizedItems);

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

  public async fetchAndSyncProductionReadings(filter?: {
    estateId?: string;
    workerId?: string;
    limit?: number;
  }) {
    if (!this.isEnabled) {
      return { status: 'skipped', message: 'Cloud IoT fetching is disabled' };
    }

    const query = new URLSearchParams();
    if (filter?.estateId) query.set('estateId', filter.estateId);
    if (filter?.workerId) query.set('workerId', filter.workerId);
    if (filter?.limit) query.set('limit', String(filter.limit));

    const url = `${this.apiUrl}${this.productionReadingsPath}${query.toString() ? `?${query.toString()}` : ''}`;
    this.logger.log(`Fetching daily production records from: ${url}`);

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
        CloudProductionReadingPayload | string
      >;
      const normalizedItems: CloudProductionReadingPayload[] = [];

      if (Array.isArray(data)) {
        for (const entry of data) {
          if (typeof entry === 'string') {
            const parsed = this.parseRawLoRaScalePacket(entry);
            if (parsed) normalizedItems.push(parsed);
          } else if (entry && typeof entry === 'object') {
            if (entry.rawMessage) {
              const parsed = this.parseRawLoRaScalePacket(entry.rawMessage);
              if (parsed) normalizedItems.push({ ...parsed, ...entry });
              else normalizedItems.push(entry);
            } else {
              normalizedItems.push(entry);
            }
          }
        }
      }

      const synced = await this.saveProductionReadings(normalizedItems);

      return {
        status: 'success',
        syncedCount: synced.length,
        items: synced,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch production records from cloud server';
      this.logger.error(
        `Error fetching production records: ${errorMessage}`,
      );
      return {
        status: 'error',
        message: errorMessage,
      };
    }
  }

  public async syncAll(filter?: { estateId?: string; limit?: number }) {
    const [workerResult, envResult, productionResult] = await Promise.all([
      this.fetchAndSyncWorkerReadings(filter),
      this.fetchAndSyncEnvironmentReadings(filter),
      this.fetchAndSyncProductionReadings(filter),
    ]);

    return {
      timestamp: new Date().toISOString(),
      workerReadings: workerResult,
      environmentReadings: envResult,
      productionReadings: productionResult,
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
        ? await this.employeesRepo
            .findOne({ where: { id: item.workerId } })
            .catch(() => null)
        : null;
      if (!worker && item.workerId) {
        worker = await this.employeesRepo.findOne({
          where: { employeeCode: item.workerId },
        });
      }

      let estate = item.estateId
        ? await this.estatesRepo
            .findOne({ where: { id: item.estateId } })
            .catch(() => null)
        : null;
      if (!estate && item.estateId) {
        estate = await this.estatesRepo.findOne({
          where: { code: item.estateId },
        });
      }

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
        ? await this.workSessionsRepo
            .findOne({
              where: { id: item.workSessionId },
            })
            .catch(() => null)
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
        altitude: item.altitude ?? item.location?.altitude,
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
        ? await this.estatesRepo
            .findOne({ where: { id: item.estateId } })
            .catch(() => null)
        : null;
      if (!estate && item.estateId) {
        estate = await this.estatesRepo.findOne({
          where: { code: item.estateId },
        });
      }

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

  public async saveProductionReadings(items: CloudProductionReadingPayload[]) {
    const savedRecords: ProductionRecord[] = [];

    for (const item of items) {
      const qty = Number(item.quantity ?? item.weight);
      if (Number.isNaN(qty) || qty <= 0) continue;

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

      let worker: Employee | null = null;
      const workerRef = item.workerId ?? item.employeeCode;
      if (workerRef) {
        worker = await this.employeesRepo
          .findOne({ where: { id: workerRef } })
          .catch(() => null);
        if (!worker) {
          worker = await this.employeesRepo.findOne({
            where: { employeeCode: workerRef },
          });
        }
      }

      let estate: Estate | null = null;
      const estateRef = item.estateId ?? item.estateCode;
      if (estateRef) {
        estate = await this.estatesRepo
          .findOne({ where: { id: estateRef } })
          .catch(() => null);
        if (!estate) {
          estate = await this.estatesRepo.findOne({
            where: { code: estateRef },
          });
        }
      }

      // Resolve worker/estate from smart scale device assignment if available
      if (device && (!worker || !estate)) {
        const activeDeviceAssignment = await this.assignmentsRepo.findOne({
          where: { device: { id: device.id }, endDate: IsNull() },
          relations: { worker: true, estate: true },
        });
        if (activeDeviceAssignment) {
          worker = worker ?? activeDeviceAssignment.worker ?? null;
          estate = estate ?? activeDeviceAssignment.estate ?? null;
        }
      }

      // Resolve estate from worker's active WorkerAssignment if estate is still missing
      if (worker && !estate) {
        const workerAssignment = await this.workerAssignmentsRepo.findOne({
          where: { worker: { id: worker.id }, endDate: IsNull() },
          relations: { estate: true },
        });
        if (workerAssignment) {
          estate = workerAssignment.estate ?? null;
        }
      }

      if (!worker || !estate) continue;

      let workSession: WorkSession | null = null;
      if (item.workSessionId) {
        workSession = await this.workSessionsRepo
          .findOne({ where: { id: item.workSessionId } })
          .catch(() => null);
      }

      if (!workSession) {
        workSession = await this.workSessionsRepo.findOne({
          where: {
            worker: { id: worker.id },
            estate: { id: estate.id },
          },
          order: { startTime: 'DESC' },
        });
      }

      if (!workSession) {
        // Auto-create a daily work session for this worker & estate so production record links cleanly
        const now = item.recordedAt ? new Date(item.recordedAt) : new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(8, 0, 0, 0);
        const createdSession = this.workSessionsRepo.create({
          worker,
          estate,
          startTime: startOfDay,
          endTime: now,
          status: 'completed',
        });
        workSession = await this.workSessionsRepo.save(createdSession);
      }

      const record = this.productionRepo.create({
        worker,
        estate,
        workSession,
        quantity: qty,
        unit: item.unit || 'kg',
        recordedAt: item.recordedAt ? new Date(item.recordedAt) : new Date(),
      });

      const saved = await this.productionRepo.save(record);
      savedRecords.push(saved);
    }

    return savedRecords;
  }
}
