import { Module } from '@nestjs/common';
import { OwnersController } from './owners.controller';
import { OwnersService } from './providers/owners.service';

@Module({
  controllers: [OwnersController],
  providers: [OwnersService],
})
export class OwnersModule {}
