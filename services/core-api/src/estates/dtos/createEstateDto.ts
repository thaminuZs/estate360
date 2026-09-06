import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { EstateStatus } from '../enums/estate-status.enum';

export class PointDto {
  @IsString()
  type!: 'Point';

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates!: [number, number];
}

export class PolygonDto {
  @IsString()
  type!: 'Polygon';

  @IsArray()
  @IsArray({ each: true })
  @IsArray({ each: true })
  coordinates!: number[][][];
}

export class CreateEstateDto {
  @IsNotEmpty()
  @IsString()
  ownerId!: string;

  @IsNotEmpty()
  @IsString()
  cropId!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name!: string;

  @IsNotEmpty()
  @IsString()
  code!: string;

  @ValidateNested()
  @Type(() => PointDto)
  location!: PointDto;

  @ValidateNested()
  @Type(() => PolygonDto)
  boundary!: PolygonDto;

  @IsOptional()
  @IsEnum(EstateStatus)
  status!: EstateStatus;
}
