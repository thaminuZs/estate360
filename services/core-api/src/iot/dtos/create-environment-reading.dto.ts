import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GeoPointDto } from './create-worker-reading.dto';

export class CreateEnvironmentReadingDto {
  @IsUUID()
  @IsNotEmpty()
  deviceId!: string;

  @IsUUID()
  @IsNotEmpty()
  estateId!: string;

  @IsDateString()
  @IsNotEmpty()
  recordedAt!: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsNumber()
  soilMoisture?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPointDto)
  location?: GeoPointDto;
}
