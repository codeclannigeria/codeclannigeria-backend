import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';

import configuration from '../../shared/config/configuration';
import { AuthService } from '../auth.service';
import { LoginReqDto } from '../models/dto/auth.dto';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequest(request);
  }
  async validateRequest(request: Request): Promise<boolean> {
    if (!configuration().isAuthEnabled) return true;
    const { email, password }: LoginReqDto = request.body;
    const user = await this.authService.validateUser(email, password);

    if (!user || !user.isActive) throw new UnauthorizedException();
    request.user = user;
    return true;
  }
}
