import { Module } from '@nestjs/common';
import { OwnersController } from './owners.controller';
import { OwnersService } from './providers/owners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owner.entity';

@Module({
  controllers: [OwnersController],
  providers: [OwnersService],
  imports: [TypeOrmModule.forFeature([Owner])],
})
export class OwnersModule {}
