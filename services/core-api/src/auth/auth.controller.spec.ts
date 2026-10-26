/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { Role } from './enums/role.enum';
import { UserStatus } from './enums/user-status.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      getProfile: jest.fn(),
    };

    const mockJwtService = {
      verifyAsync: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with owner registration dto', async () => {
      const dto = {
        email: 'owner@example.com',
        password: 'Password123@',
        role: Role.OWNER,
        name: 'Owner Name',
      };
      const expectedResponse = {
        message: 'User registered successfully',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-id',
          email: dto.email,
          role: Role.OWNER,
          status: UserStatus.ACTIVE,
          lastLogin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: null,
        },
      };

      authService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(dto);
      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should call authService.login with credentials', async () => {
      const dto = {
        email: 'admin@estate360.com',
        password: 'AdminPassword123@',
      };
      const expectedResponse = {
        message: 'Login successful',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'admin-id',
          email: dto.email,
          role: Role.ADMIN,
          status: UserStatus.ACTIVE,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: null,
        },
      };

      authService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(dto);
      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken', async () => {
      const dto = { refreshToken: 'valid-refresh-token' };
      const expectedResponse = {
        message: 'Tokens refreshed successfully',
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      authService.refreshToken.mockResolvedValue(expectedResponse);

      const result = await controller.refreshToken(dto);
      expect(authService.refreshToken).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getProfile', () => {
    it('should return profile for the active user', async () => {
      const expectedUser = {
        id: 'user-id',
        email: 'owner@example.com',
        role: Role.OWNER,
        status: UserStatus.ACTIVE,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: null,
      };

      authService.getProfile.mockResolvedValue(expectedUser);

      const result = await controller.getProfile('user-id');
      expect(authService.getProfile).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(expectedUser);
    });
  });

  describe('createAdmin', () => {
    it('should set role to ADMIN and call register', async () => {
      const dto = {
        email: 'newadmin@estate360.com',
        password: 'Password123@',
      };

      const expectedResponse = {
        message: 'User registered successfully',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'admin-id',
          email: dto.email,
          role: Role.ADMIN,
          status: UserStatus.ACTIVE,
          lastLogin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: null,
        },
      };

      authService.register.mockResolvedValue(expectedResponse);

      await controller.createAdmin(dto);
      expect(authService.register).toHaveBeenCalledWith({
        ...dto,
        role: Role.ADMIN,
      });
    });
  });
});
