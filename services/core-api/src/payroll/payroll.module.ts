import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstatePayRate } from './entities/estate-pay-rate.entity';
import { Payroll } from './entities/payroll.entity';
import { PayrollItem } from './entities/payroll-item.entity';
import { Payment } from './entities/payment.entity';
import { Estate } from 'src/estates/estate.entity';
import { Owner } from 'src/owners/owner.entity';
import { Employee } from 'src/employees/employee.entity';
import { ProductionRecord } from 'src/production/production-record.entity';
import { PayrollService } from './providers/payroll.service';
import { PayrollController } from './payroll.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EstatePayRate,
      Payroll,
      PayrollItem,
      Payment,
      Estate,
      Owner,
      Employee,
      ProductionRecord,
    ]),
    AuthModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
