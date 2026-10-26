import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePaymentDetailDto {
  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  paymentFrequency!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  bankName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  accountNumber!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  accountName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  branch!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
