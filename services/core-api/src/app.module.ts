import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [OwnersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
