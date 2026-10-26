import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../enums/role.enum';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockContext = (user?: ActiveUserData): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createMockContext({
      sub: 'uuid-1',
      email: 'owner@estate360.com',
      role: Role.OWNER,
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user has the required admin role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const context = createMockContext({
      sub: 'uuid-2',
      email: 'admin@estate360.com',
      role: Role.ADMIN,
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user has owner role and owner is allowed', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN, Role.OWNER]);

    const context = createMockContext({
      sub: 'uuid-3',
      email: 'owner@estate360.com',
      role: Role.OWNER,
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException when user does not have required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const context = createMockContext({
      sub: 'uuid-4',
      email: 'owner@estate360.com',
      role: Role.OWNER,
    });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw UnauthorizedException when no user is attached to the request', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
