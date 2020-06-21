import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import configuration from '~shared/config/configuration';
import { AUTH_GUARD_TYPE } from '~shared/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AUTH_GUARD_TYPE) {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // console.log(context.switchToHttp().getRequest().sessionID);
    return configuration().isAuthEnabled ? super.canActivate(context) : true;
  }
}
