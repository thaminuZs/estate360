import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentDetailsController } from './payment-details.controller';
import { PaymentDetailsService } from './providers/payment-details.service';
import { EmployeePaymentDetail } from './payment-details.entity';
import { Employee } from 'src/employees/employee.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeePaymentDetail, Employee]),
    AuthModule,
  ],
  controllers: [PaymentDetailsController],
  providers: [PaymentDetailsService],
  exports: [PaymentDetailsService],
})
export class PaymentDetailsModule {}
