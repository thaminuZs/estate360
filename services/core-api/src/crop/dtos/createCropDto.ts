import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCropDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  code!: string;

  @IsNotEmpty()
  @Type(() => Number)
  paymentFactor!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
