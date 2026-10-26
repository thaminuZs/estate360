import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IotCloudFetchService } from './iot-cloud-fetch.service';
import { WorkerIotReading } from '../entities/worker-iot-reading.entity';
import { EnvironmentIotReading } from '../entities/environment-iot-reading.entity';
import { Device } from '../entities/device.entity';
import { DeviceAssignment } from '../entities/device-assignment.entity';
import { Employee } from 'src/employees/employee.entity';
import { Estate } from 'src/estates/estate.entity';
import { WorkSession } from 'src/work-sessions/work-session.entity';

describe('IotCloudFetchService', () => {
  let service: IotCloudFetchService;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn((dto: unknown) => dto as object),
    save: jest.fn((entity: object) => Promise.resolve({ id: '1', ...entity })),
  };

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'IOT_CLOUD_API_URL') return 'https://api.test-cloud.com';
        if (key === 'IOT_CLOUD_API_KEY') return 'test-key-123';
        if (key === 'IOT_CLOUD_WORKER_PATH') return '/readings/workers';
        if (key === 'IOT_CLOUD_ENV_PATH') return '/readings/environment';
        if (key === 'IOT_CLOUD_FETCH_ENABLED') return 'true';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IotCloudFetchService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getRepositoryToken(WorkerIotReading), useValue: mockRepo },
        {
          provide: getRepositoryToken(EnvironmentIotReading),
          useValue: mockRepo,
        },
        { provide: getRepositoryToken(Device), useValue: mockRepo },
        { provide: getRepositoryToken(DeviceAssignment), useValue: mockRepo },
        { provide: getRepositoryToken(Employee), useValue: mockRepo },
        { provide: getRepositoryToken(Estate), useValue: mockRepo },
        { provide: getRepositoryToken(WorkSession), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<IotCloudFetchService>(IotCloudFetchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return initial cloud fetch configuration', () => {
    const config = service.getConfig();
    expect(config.apiUrl).toBe('https://api.test-cloud.com');
    expect(config.workerReadingsPath).toBe('/readings/workers');
    expect(config.environmentReadingsPath).toBe('/readings/environment');
    expect(config.fullWorkerUrl).toBe(
      'https://api.test-cloud.com/readings/workers',
    );
    expect(config.fullEnvUrl).toBe(
      'https://api.test-cloud.com/readings/environment',
    );
  });

  it('should dynamically update cloud configuration at runtime', () => {
    const updated = service.updateConfig({
      apiUrl: 'https://new-cloud-server.org/',
      workerReadingsPath: 'v2/telemetry/workers',
      environmentReadingsPath: '/v2/telemetry/env',
    });

    expect(updated.apiUrl).toBe('https://new-cloud-server.org');
    expect(updated.workerReadingsPath).toBe('/v2/telemetry/workers');
    expect(updated.environmentReadingsPath).toBe('/v2/telemetry/env');
    expect(updated.fullWorkerUrl).toBe(
      'https://new-cloud-server.org/v2/telemetry/workers',
    );
  });

  it('should skip cloud fetch when disabled', async () => {
    service.updateConfig({ enabled: false });
    const result = await service.fetchAndSyncWorkerReadings();
    expect(result.status).toBe('skipped');
  });

  it('should parse raw LoRa worker packet from worker_device.ino', () => {
    const raw =
      'WORKER|550e8400-e29b-41d4-a716-446655440000|LAT=6.927100|LON=79.861200|ALT=12.50|STATUS=ACTIVE';
    const parsed = service.parseRawLoRaWorkerPacket(raw);

    expect(parsed).toEqual({
      deviceId: '550e8400-e29b-41d4-a716-446655440000',
      deviceCode: '550e8400-e29b-41d4-a716-446655440000',
      activityStatus: 'ACTIVE',
      location: {
        latitude: 6.9271,
        longitude: 79.8612,
      },
    });
  });
});
