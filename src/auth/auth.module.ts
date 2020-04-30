import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { TemporaryToken } from '../shared/models/temporary-token.entity';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { AuthHandler } from './handlers/auth.handler';
import { SessionSerializer } from './session.serializer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TempTokensService } from './temp-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TemporaryToken.modelName, schema: TemporaryToken.schema },
    ]),

    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    AuthHandler,
    TempTokensService,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
