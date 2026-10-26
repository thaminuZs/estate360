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

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  payrollItemId!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsDateString()
  @IsNotEmpty()
  paymentDate!: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(150)
  transactionReference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
