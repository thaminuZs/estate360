import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { BcryptService } from './bcrypt.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { Owner } from 'src/owners/owner.entity';
import { OwnerStatus } from 'src/owners/enums/owner-status.enum';
import type { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,

    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const normalizedEmail = registerDto.email.trim().toLowerCase();

    const existingUser = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const role = registerDto.role ?? Role.OWNER;
    const passwordHash = await this.bcryptService.hashPassword(
      registerDto.password,
    );

    let linkedOwner: Owner | null = null;

    if (role === Role.OWNER) {
      linkedOwner = await this.ownersRepository.findOne({
        where: { email: normalizedEmail },
      });

      if (!linkedOwner) {
        const newOwner = this.ownersRepository.create({
          name: registerDto.name ?? normalizedEmail.split('@')[0],
          email: normalizedEmail,
          phone: registerDto.phone ?? '',
          address: registerDto.address ?? '',
          status: OwnerStatus.ACTIVE,
        });
        linkedOwner = await this.ownersRepository.save(newOwner);
      }
    }

    const newUser = this.usersRepository.create({
      email: normalizedEmail,
      passwordHash,
      role,
      status: UserStatus.ACTIVE,
      owner: linkedOwner,
    });

    const savedUser = await this.usersRepository.save(newUser);
    const tokens = await this.generateTokens(savedUser);

    return {
      message: 'User registered successfully',
      ...tokens,
      user: this.sanitizeUser(savedUser),
    };
  }

  public async login(loginDto: LoginDto) {
    const normalizedEmail = loginDto.email.trim().toLowerCase();

    const user = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
      relations: { owner: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        `Account is currently ${user.status}. Please contact support.`,
      );
    }

    const isPasswordValid = await this.bcryptService.comparePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.role === Role.OWNER && !user.owner) {
      let linkedOwner = await this.ownersRepository.findOne({
        where: { email: normalizedEmail },
      });
      if (!linkedOwner) {
        linkedOwner = await this.ownersRepository.save(
          this.ownersRepository.create({
            name: normalizedEmail.split('@')[0],
            email: normalizedEmail,
            status: OwnerStatus.ACTIVE,
          }),
        );
      }
      user.owner = linkedOwner;
    }

    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    const tokens = await this.generateTokens(user);

    return {
      message: 'Login successful',
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const jwtSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ??
      this.configService.get<string>('JWT_SECRET') ??
      'estate360-jwt-secret-key-super-safe';

    try {
      const payload = await this.jwtService.verifyAsync<ActiveUserData>(
        refreshTokenDto.refreshToken,
        { secret: jwtSecret },
      );

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
        relations: { owner: true },
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException(
          'User not found or account is no longer active',
        );
      }

      const tokens = await this.generateTokens(user);

      return {
        message: 'Tokens refreshed successfully',
        ...tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  public async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { owner: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.trim().toLowerCase() },
      relations: { owner: true },
    });
  }

  public async findUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  private async generateTokens(user: User) {
    const payload: ActiveUserData = {
      sub: user.id,
      email: user.email,
      role: user.role,
      ownerId: user.owner ? user.owner.id : null,
    };

    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') ??
      'estate360-jwt-secret-key-super-safe';

    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ?? jwtSecret;

    const accessTokenExpiresIn = (this.configService.get<string>(
      'JWT_EXPIRES_IN',
    ) ?? '1d') as SignOptions['expiresIn'];

    const refreshTokenExpiresIn = (this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    ) ?? '7d') as SignOptions['expiresIn'];

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtRefreshSecret,
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      owner: user.owner
        ? {
            id: user.owner.id,
            name: user.owner.name,
            contactEmail: user.owner.contactEmail,
            phone: user.owner.phone,
            address: user.owner.address,
            status: user.owner.status,
          }
        : null,
    };
  }
}
