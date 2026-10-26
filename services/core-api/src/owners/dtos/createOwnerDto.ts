import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { OwnerStatus } from '../enums/owner-status.enum';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ValidateIf((o: CreateOwnerDto) => !o.contactEmail)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ValidateIf((o: CreateOwnerDto) => !o.email)
  @IsEmail()
  @IsNotEmpty()
  contactEmail?: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  address?: string;

  @IsOptional()
  @IsEnum(OwnerStatus)
  status?: OwnerStatus;
}
