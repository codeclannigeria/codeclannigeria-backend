import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
export const authErrors = {
  INVALID_LOGIN_ATTEMPT: new UnauthorizedException(
    'Email or Password is incorrect'
  ),
  INVALID_TOKEN: new ForbiddenException('Invalid token'),
  EXPIRED_TOKEN: new NotFoundException('Token expired')
};
