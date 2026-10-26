import { PartialType } from '@nestjs/mapped-types';
import { CreateEstateDto } from './createEstateDto';

export class UpdateEstateDto extends PartialType(CreateEstateDto) {}
