import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateDeviceAssignmentDto {
  @IsUUID()
  @IsNotEmpty()
  deviceId!: string;

  @IsOptional()
  @IsUUID()
  workerId?: string;

  @IsUUID()
  @IsNotEmpty()
  estateId!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
