import { Module } from '@nestjs/common';
import { EstatesController } from './estates.controller';
import { EstatesService } from './providers/estates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estate } from './estate.entity';

@Module({
  controllers: [EstatesController],
  providers: [EstatesService],
  imports: [TypeOrmModule.forFeature([Estate])],
})
export class EstatesModule {}
