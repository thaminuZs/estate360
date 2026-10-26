import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CheckInAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  workerId!: string;

  @IsUUID()
  @IsNotEmpty()
  estateId!: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CheckOutAttendanceDto {
  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
