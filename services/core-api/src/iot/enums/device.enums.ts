export enum DeviceType {
  WORKER_TRACKER = 'worker_tracker',
  ENVIRONMENTAL_SENSOR = 'environmental_sensor',
  WEIGHT_SCALE = 'weight_scale',
  BASE_STATION = 'base_station',
  GPS_TAG = 'gps_tag',
}

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  DECOMMISSIONED = 'decommissioned',
}
