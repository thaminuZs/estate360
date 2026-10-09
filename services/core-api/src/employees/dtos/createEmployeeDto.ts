import {
  IsDate,
  IsEnum,
  IsIdentityCard,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { EmployeeStatus } from '../enums/employee-status.enum';

export class CreateEmployeeDto {
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

  @IsNotEmpty()
  @IsPhoneNumber('LK')
  phone!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsDate()
  dateJoined?: Date;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
