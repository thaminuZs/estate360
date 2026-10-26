import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DeviceStatus, DeviceType } from '../enums/device.enums';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  deviceCode!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  deviceType!: DeviceType | string;

  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;
}
