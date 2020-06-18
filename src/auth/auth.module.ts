import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { MailService } from '../mail/mail.service';
import { TemporaryToken } from '../shared/models/temporary-token.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHandler } from './handlers/auth.handler';
import { SessionSerializer } from './session.serializer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TempTokensService } from './temp-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TemporaryToken.modelName, schema: TemporaryToken.schema }
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    UsersModule
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    MailService,
    AuthHandler,
    TempTokensService
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    MongooseModule.forFeature([
      { name: TemporaryToken.modelName, schema: TemporaryToken.schema }
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true })
  ]
})
export class AuthModule {}
