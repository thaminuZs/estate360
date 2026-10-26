import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Role } from '../enums/role.enum';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

interface RequestWithUser {
  headers: {
    authorization?: string;
  };
  user?: ActiveUserData;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;
  let reflector: Reflector;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as JwtService;

    configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;

    reflector = new Reflector();
    guard = new AuthGuard(jwtService, configService, reflector);
  });

  const createMockContext = (
    authorizationHeader?: string,
  ): { context: ExecutionContext; req: RequestWithUser } => {
    const req: RequestWithUser = {
      headers: {
        authorization: authorizationHeader,
      },
    };

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;

    return { context, req };
  };

  it('should allow access if route is marked as @Public()', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const { context } = createMockContext(undefined);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if authorization header is missing', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const { context } = createMockContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));

    const { context } = createMockContext('Bearer invalid.jwt.token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should attach user payload to request and return true for valid token', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const mockPayload: ActiveUserData = {
      sub: 'user-uuid',
      email: 'admin@estate360.com',
      role: Role.ADMIN,
      ownerId: null,
    };
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

    const { context, req } = createMockContext('Bearer valid.jwt.token');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(req.user).toEqual(mockPayload);
  });
});
