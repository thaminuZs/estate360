import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Owner } from 'src/owners/owner.entity';
import { AuthController } from './auth.controller';
import { BcryptService } from './providers/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { OwnersModule } from 'src/owners/owners.module';
import type { SignOptions } from 'jsonwebtoken';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcryptService, AuthGuard, RolesGuard],
  exports: [AuthService, BcryptService, AuthGuard, RolesGuard, JwtModule],
  imports: [
    TypeOrmModule.forFeature([User, Owner]),
    ConfigModule,
    forwardRef(() => OwnersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = (configService.get<string>('JWT_EXPIRES_IN') ??
          '1d') as SignOptions['expiresIn'];

        return {
          secret:
            configService.get<string>('JWT_SECRET') ??
            'estate360-jwt-secret-key-super-safe',
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
