import { Module } from '@nestjs/common';
import { CropsController } from './crop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crop } from './crop.entity';
import { CropsService } from './providers/crops.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CropsController],
  providers: [CropsService],
  imports: [TypeOrmModule.forFeature([Crop]), AuthModule],
})
export class CropModule {}
