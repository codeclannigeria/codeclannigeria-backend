import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AUTH_GUARD_TYPE } from '~shared/constants';

import { MailService } from '../shared/mail/mail.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TemporaryToken } from './models/temporary-token.entity';
import { SessionSerializer } from './session.serializer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TempTokensService } from './temp-token.service';

const Config = [
  MongooseModule.forFeature([
    { name: TemporaryToken.modelName, schema: TemporaryToken.schema }
  ]),
  PassportModule.register({ defaultStrategy: AUTH_GUARD_TYPE, session: true })
];
@Module({
  imports: [UsersModule, ...Config],
  providers: [
    AuthService,
    JwtStrategy,
    SessionSerializer,
    MailService,
    TempTokensService
  ],
  controllers: [AuthController],
  exports: [AuthService, ...Config]
})
export class AuthModule {}
