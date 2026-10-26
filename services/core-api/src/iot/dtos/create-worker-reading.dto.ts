import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GeoPointDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}

export class CreateWorkerReadingDto {
  @IsUUID()
  @IsNotEmpty()
  deviceId!: string;

  @IsUUID()
  @IsNotEmpty()
  workerId!: string;

  @IsUUID()
  @IsNotEmpty()
  estateId!: string;

  @IsUUID()
  @IsNotEmpty()
  workSessionId!: string;

  @IsOptional()
  @IsDateString()
  recordedAt?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPointDto)
  location?: GeoPointDto;

  @IsOptional()
  @IsString()
  activityStatus?: string;
}
