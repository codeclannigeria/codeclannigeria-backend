import { EventPattern } from '@nestjs/microservices';
import { Injectable, Logger } from '@nestjs/common';
import { AuthEventEnum } from '../models/auth.enums';

@Injectable()
export class AuthHandler {
  @EventPattern(AuthEventEnum.UserRegistered)
  async handleUserRegistered(data: Record<string, unknown>) {
    // business logic
    Logger.debug(data);
  }
}
