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

export class CreatePayRateDto {
  @IsUUID()
  @IsNotEmpty()
  estateId!: string;

  @IsNumber()
  @IsPositive()
  rate!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit!: string;

  @IsNumber()
  @IsPositive()
  paymentFactor!: number;

  @IsDateString()
  @IsNotEmpty()
  effectiveFrom!: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}
