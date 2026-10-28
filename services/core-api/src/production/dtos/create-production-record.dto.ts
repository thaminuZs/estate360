import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProductionRecordDto {
  @IsUUID()
  @IsNotEmpty()
  workerId!: string;

  @IsUUID()
  @IsNotEmpty()
  estateId!: string;

  @IsOptional()
  @IsUUID()
  workSessionId?: string;

  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit!: string;

  @IsOptional()
  @IsDateString()
  recordedAt?: string;
}
