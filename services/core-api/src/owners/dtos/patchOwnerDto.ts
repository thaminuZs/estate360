import { PartialType } from '@nestjs/mapped-types';
import { CreateOwnerDto } from './createOwnerDto';

export class PatchOwnerDto extends PartialType(CreateOwnerDto) {}
