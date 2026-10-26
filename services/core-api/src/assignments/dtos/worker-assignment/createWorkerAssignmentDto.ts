import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateWorkerAssignmentDto {
  @IsNotEmpty()
  @IsUUID()
  workerId!: string;

  @IsNotEmpty()
  @IsUUID()
  estateId!: string;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @IsOptional()
  @IsUUID()
  superVisorId?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
