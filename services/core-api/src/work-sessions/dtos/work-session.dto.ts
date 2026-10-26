import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateWorkSessionDto {
  @IsUUID()
  @IsNotEmpty()
  workerId!: string;

  @IsUUID()
  @IsNotEmpty()
  estateId!: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class EndWorkSessionDto {
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
