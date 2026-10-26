import { forwardRef, Module } from '@nestjs/common';
import { OwnersController } from './owners.controller';
import { OwnersService } from './providers/owners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owner.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/users.entity';

@Module({
  controllers: [OwnersController],
  providers: [OwnersService],
  imports: [
    TypeOrmModule.forFeature([Owner, User]),
    forwardRef(() => AuthModule),
  ],
  exports: [OwnersService],
})
export class OwnersModule {}
