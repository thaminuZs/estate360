import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnersModule } from './owners/owners.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owners/owner.entity';

@Module({
  imports: [
    OwnersModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        entities: [Owner],
        synchronize: true,
        port: 5432,
        host: 'localhost',
        username: 'postgres',
        password: 'toor',
        database: 'estate360-test',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
