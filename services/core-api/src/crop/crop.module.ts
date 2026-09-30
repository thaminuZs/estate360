import { Module } from '@nestjs/common';
import { CropsController } from './crop.controller';

@Module({
  controllers: [CropsController],
  imports: [],
})
export class CropModule {}
