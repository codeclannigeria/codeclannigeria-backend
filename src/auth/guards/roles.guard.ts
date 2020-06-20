import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import configuration from '~shared/config/configuration';

import { UserRole } from '../../users/models/user.entity';
import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>(
      UserRole,
      context.getHandler()
    );

    if (!configuration().isAuthEnabled || !roles) return true;
    console.log(roles);

    const request = context.switchToHttp().getRequest<Request>();
    const { role } = request.user as JwtPayload;

    return roles.includes(role);
  }
}
