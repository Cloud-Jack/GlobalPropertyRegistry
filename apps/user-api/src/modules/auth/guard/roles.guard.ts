import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiException } from 'libs/utils';

import { Role, ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<typeof Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ApiException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    return requiredRole === user.role;
  }
}
