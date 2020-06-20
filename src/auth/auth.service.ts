import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException
} from '@nestjs/common';
import { Client, ClientRedis, Transport } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import configuration from '~shared/config/configuration';
import { TokenType } from 'src/auth/models/temporary-token.entity';
import { generateRandomToken } from '~shared/utils/random-token';

import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { AuthEventEnum } from './models/auth.enums';
import { JwtPayload } from './models/jwt-payload';
import { TempTokensService } from './temp-token.service';
import { authErrors } from '~shared/errors';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TempTokensService
  ) {}
  @Client({ transport: Transport.REDIS })
  private client: ClientRedis;

  async onModuleInit() {
    // Connect your client to the redis server on startup.
    try {
      // await this.client.connect();
    } catch (error) {
      //Logger.error(error);
    }
  }
  async validateUser(email: string, pw: string): Promise<User> {
    const user = await this.usersService.findOneAsync({ email });
    if (!user) throw authErrors.INVALID_LOGIN_ATTEMPT;
    if (!user.isEmailVerified)
      throw new UnauthorizedException('Please confirm your email');
    try {
      const isValid = await bcrypt.compare(pw, user.password);
      if (!isValid) throw authErrors.INVALID_LOGIN_ATTEMPT;
    } catch (error) {
      Logger.error(error);
      throw authErrors.INVALID_LOGIN_ATTEMPT;
    }
    return user;
  }

  async login(email: string, pass: string): Promise<string> {
    const user = await this.usersService.findOneAsync({ email });

    if (!user) throw authErrors.INVALID_LOGIN_ATTEMPT;

    const isValidPassword = await bcrypt.compare(pass, user.password);
    if (!isValidPassword) throw authErrors.INVALID_LOGIN_ATTEMPT;

    const { jwtValidityHrs, jwtSecret } = configuration();
    const expiresIn = 60 * 60 * jwtValidityHrs;
    const payload: JwtPayload = {
      email: user.email,
      userId: user.id,
      role: user.role
    };
    return jwt.sign(payload, jwtSecret, { expiresIn });
  }

  async pub(): Promise<void> {
    this.client.emit(AuthEventEnum.UserRegistered, 'email');
  }

  async generateTempToken({
    user,
    type,
    expiresInMins
  }: {
    user: User;
    type: TokenType;
    expiresInMins: number;
  }): Promise<string> {
    const plainToken = generateRandomToken(64);
    const encryptedToken = await bcrypt.hash(plainToken, 10);
    const token = this.tokenService.createEntity({
      token: encryptedToken,
      expireAt: new Date(new Date().getTime() + expiresInMins * 60000),
      type,
      user: user.id as any
    });
    await this.tokenService.insertAsync(token);
    return plainToken;
  }
  async validateEmailToken(input: {
    userId: string;
    plainToken: string;
  }): Promise<void> {
    const { userId, plainToken } = input;

    const { user, id } = await this.validateToken(
      userId,
      TokenType.EMAIL,
      plainToken
    );

    const doc = user as User;
    await this.usersService.updateAsync(doc.id, { isEmailVerified: true });
    await this.tokenService.hardDeleteById(id);
  }
  async validatePasswordToken(resetPassInput: {
    userId: string;
    plainToken: string;
    newPassword: string;
  }): Promise<void> {
    const { userId, plainToken, newPassword } = resetPassInput;
    const { user, id } = await this.validateToken(
      userId,
      TokenType.PASSWORD,
      plainToken
    );
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const doc = user as User;
    await this.usersService.updateAsync(doc.id, { password: passwordHash });
    await this.tokenService.hardDeleteById(id);
  }
  private async validateToken(
    userId: string,
    type: TokenType,
    plainToken: string
  ) {
    const exist = await this.tokenService
      .findOne({ user: userId, type })
      .populate('user');

    if (!exist) throw authErrors.EXPIRED_TOKEN;
    try {
      const isValid = await bcrypt.compare(plainToken, exist.token);
      if (!isValid) throw authErrors.INVALID_TOKEN;
    } catch (error) {
      throw authErrors.INVALID_TOKEN;
    }
    return exist;
  }
}
