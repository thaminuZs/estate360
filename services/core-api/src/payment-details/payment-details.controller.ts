import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentDetailsService } from './providers/payment-details.service';
import { CreatePaymentDetailDto } from './dtos/createPaymentDetail.dto';
import { UpdatePaymentDetailDto } from './dtos/updatePaymentDetail.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('payment-details')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentDetailsController {
  constructor(private readonly paymentDetailsService: PaymentDetailsService) {}

  @Roles(Role.ADMIN, Role.OWNER)
  @Post()
  public create(
    @Body() createDto: CreatePaymentDetailDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.paymentDetailsService.create(createDto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findAll(@ActiveUser() user: ActiveUserData) {
    return this.paymentDetailsService.findAll(user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('employee/:employeeId')
  public findByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.paymentDetailsService.findByEmployeeId(employeeId, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Patch(':id')
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePaymentDetailDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.paymentDetailsService.update(id, updateDto, user);
  }
}
