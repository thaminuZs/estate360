import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDetailDto } from './createPaymentDetail.dto';

export class UpdatePaymentDetailDto extends PartialType(
  CreatePaymentDetailDto,
) {}
