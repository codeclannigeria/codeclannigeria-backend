import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import configuration from '../../shared/config/configuration';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // console.log(context.switchToHttp().getRequest().sessionID);
    return configuration().isAuthEnabled ? super.canActivate(context) : true;
  }
}
