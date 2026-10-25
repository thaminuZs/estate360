import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PayrollService } from './providers/payroll.service';
import { CreatePayRateDto } from './dtos/create-pay-rate.dto';
import { GeneratePayrollDto } from './dtos/generate-payroll.dto';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('payroll')
@UseGuards(AuthGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // Pay Rates
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('rates')
  public createPayRate(
    @Body() dto: CreatePayRateDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.payrollService.createPayRate(dto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('rates/estate/:estateId')
  public findRatesByEstate(
    @Param('estateId', ParseUUIDPipe) estateId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.payrollService.findPayRatesByEstate(estateId, user);
  }

  // Payroll
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('generate')
  public generatePayroll(
    @Body() dto: GeneratePayrollDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.payrollService.generatePayroll(dto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get()
  public findPayrolls(
    @Query('ownerId') ownerId?: string,
    @ActiveUser() user?: ActiveUserData,
  ) {
    return this.payrollService.findPayrolls(ownerId, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get(':id')
  public findPayrollById(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.payrollService.findPayrollById(id, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Patch(':id/process')
  public processPayroll(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.payrollService.processPayroll(id, user);
  }

  // Payments
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('payments')
  public createPayment(
    @Body() dto: CreatePaymentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.payrollService.createPayment(dto, user);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('payments/all')
  public findPayments(@ActiveUser() user: ActiveUserData) {
    return this.payrollService.findPayments(user);
  }
}
