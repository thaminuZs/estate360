import { PartialType } from '@nestjs/mapped-types';
import { CreateEstateAssignmentDto } from './createEstateAssignmentDto';

export class UpdateEstateAssignmentDto extends PartialType(
  CreateEstateAssignmentDto,
) {}
