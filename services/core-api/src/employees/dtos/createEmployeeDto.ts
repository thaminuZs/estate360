import {
  IsDate,
  IsEnum,
  IsIdentityCard,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { EmployeeStatus } from '../enums/employee-status.enum';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @IsNotEmpty()
  @IsString()
  employeeCode!: string;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsIdentityCard('LK')
  nic!: string;

  @IsOptional()
  @IsPhoneNumber('LK')
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateJoined?: Date;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
