import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
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
  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @ValidateIf((o: CreateEstateDto) => !o.cropId)
  @IsNotEmpty()
  @IsString()
  crop?: string;

  @ValidateIf((o: CreateEstateDto) => !o.crop)
  @IsNotEmpty()
  @IsString()
  cropId?: string;

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
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsEnum(EstateStatus)
  status?: EstateStatus;
}
