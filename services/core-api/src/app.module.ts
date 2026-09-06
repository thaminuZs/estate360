import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnersModule } from './owners/owners.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owners/owner.entity';
import { User } from './auth/entities/users.entity';
import { EstatesModule } from './estates/estates.module';
import { AuthModule } from './auth/auth.module';
import { Estate } from './estates/estate.entity';

@Module({
  imports: [
    OwnersModule,
    EstatesModule,
    AuthModule,

    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        entities: [Owner, User, Estate],
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
