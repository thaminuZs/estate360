import { Module } from '@nestjs/common';
import { OwnersController } from './owners.controller';

@Module({
  controllers: [OwnersController],
  providers: [],
})
export class OwnersModule {}
