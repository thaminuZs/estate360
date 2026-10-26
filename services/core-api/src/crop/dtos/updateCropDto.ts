import { PartialType } from '@nestjs/mapped-types';
import { CreateCropDto } from './createCropDto';

export class UpdateCropDto extends PartialType(CreateCropDto) {}
