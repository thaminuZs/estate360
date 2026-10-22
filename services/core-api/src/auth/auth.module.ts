import { Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
