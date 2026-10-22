import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './createEmployeeDto';

export class PatchEmployeeDto extends PartialType(CreateEmployeeDto) {}
