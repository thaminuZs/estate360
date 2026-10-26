/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { BcryptService } from './bcrypt.service';
import { User } from '../entities/users.entity';
import { Owner } from 'src/owners/owner.entity';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: jest.Mocked<Repository<User>>;
  let ownersRepository: jest.Mocked<Repository<Owner>>;
  let bcryptService: jest.Mocked<BcryptService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockOwnersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockBcryptService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-jwt-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        if (key === 'JWT_EXPIRES_IN') return '1d';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: getRepositoryToken(Owner), useValue: mockOwnersRepository },
        { provide: BcryptService, useValue: mockBcryptService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(User));
    ownersRepository = module.get(getRepositoryToken(Owner));
    bcryptService = module.get(BcryptService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new owner user and create an owner record', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      ownersRepository.findOne.mockResolvedValue(null);
      bcryptService.hashPassword.mockResolvedValue('hashedPassword123');

      const mockOwner = {
        id: 'owner-uuid-1',
        name: 'John Owner',
        contactEmail: 'owner@example.com',
        phone: '0712345678',
        address: '123 Estate Road',
        status: 'active',
      } as Owner;
      ownersRepository.create.mockReturnValue(mockOwner);
      ownersRepository.save.mockResolvedValue(mockOwner);

      const mockUser = {
        id: 'user-uuid-1',
        email: 'owner@example.com',
        passwordHash: 'hashedPassword123',
        role: Role.OWNER,
        status: UserStatus.ACTIVE,
        owner: mockOwner,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      usersRepository.create.mockReturnValue(mockUser);
      usersRepository.save.mockResolvedValue(mockUser);

      jwtService.signAsync
        .mockResolvedValueOnce('access-token-123')
        .mockResolvedValueOnce('refresh-token-456');

      const result = await authService.register({
        email: 'owner@example.com',
        password: 'Password123@',
        role: Role.OWNER,
        name: 'John Owner',
        phone: '0712345678',
        address: '123 Estate Road',
      });

      expect(result.accessToken).toBe('access-token-123');
      expect(result.refreshToken).toBe('refresh-token-456');
      expect(result.user.email).toBe('owner@example.com');
      expect(result.user.role).toBe(Role.OWNER);
      expect(result.user.owner?.id).toBe('owner-uuid-1');
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should register an admin user without creating an owner record', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      bcryptService.hashPassword.mockResolvedValue('hashedAdminPass');

      const mockAdminUser = {
        id: 'admin-uuid-1',
        email: 'admin@estate360.com',
        passwordHash: 'hashedAdminPass',
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        owner: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      usersRepository.create.mockReturnValue(mockAdminUser);
      usersRepository.save.mockResolvedValue(mockAdminUser);

      jwtService.signAsync
        .mockResolvedValueOnce('admin-access-token')
        .mockResolvedValueOnce('admin-refresh-token');

      const result = await authService.register({
        email: 'admin@estate360.com',
        password: 'AdminPassword123@',
        role: Role.ADMIN,
      });

      expect(ownersRepository.create).not.toHaveBeenCalled();
      expect(result.user.role).toBe(Role.ADMIN);
      expect(result.user.owner).toBeNull();
    });

    it('should throw ConflictException if user already exists', async () => {
      usersRepository.findOne.mockResolvedValue({ id: 'existing-id' } as User);

      await expect(
        authService.register({
          email: 'duplicate@example.com',
          password: 'Password123@',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully log in and return tokens with sanitized user', async () => {
      const mockUser = {
        id: 'user-uuid-1',
        email: 'admin@estate360.com',
        passwordHash: 'hashedPass',
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        owner: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      usersRepository.findOne.mockResolvedValue(mockUser);
      bcryptService.comparePassword.mockResolvedValue(true);
      usersRepository.save.mockResolvedValue(mockUser);
      jwtService.signAsync
        .mockResolvedValueOnce('login-access-token')
        .mockResolvedValueOnce('login-refresh-token');

      const result = await authService.login({
        email: 'admin@estate360.com',
        password: 'Password123@',
      });

      expect(result.accessToken).toBe('login-access-token');
      expect(result.refreshToken).toBe('login-refresh-token');
      expect(result.user.email).toBe('admin@estate360.com');
      expect(result.user.role).toBe(Role.ADMIN);
      expect(
        (result.user as Record<string, unknown>).passwordHash,
      ).toBeUndefined();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'admin@estate360.com',
        passwordHash: 'hashedPass',
        status: UserStatus.ACTIVE,
      } as User);
      bcryptService.comparePassword.mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'admin@estate360.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if account is disabled or suspended', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'admin@estate360.com',
        passwordHash: 'hashedPass',
        status: UserStatus.DISABLED,
      } as User);

      await expect(
        authService.login({
          email: 'admin@estate360.com',
          password: 'Password123@',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
