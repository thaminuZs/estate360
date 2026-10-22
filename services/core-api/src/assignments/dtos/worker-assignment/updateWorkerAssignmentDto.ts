import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerAssignmentDto } from './createWorkerAssignmentDto';

export class UpdateWorkerAssignmentDto extends PartialType(
  CreateWorkerAssignmentDto,
) {}
