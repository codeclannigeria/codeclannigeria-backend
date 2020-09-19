import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import configuration from '~shared/config/configuration';
import { authErrors } from '~shared/errors';
import { generateRandomToken } from '~shared/utils/random-token';

import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './models/jwt-payload';
import { TokenType } from './models/temporary-token.entity';
import { TempTokensService } from './temp-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TempTokensService
  ) {}
  async validateUser(email: string, pw: string): Promise<User> {
    const user = await this.usersService.findOneAsync({
      email: email?.toLowerCase()
    });

    if (!user) throw authErrors.INVALID_LOGIN_ATTEMPT;

    if (user.loginAttemptCount >= 3) {
      throw new HttpException(
        { message: 'User is locked out', errorType: 'USER_LOCKED_OUT' },
        HttpStatus.UNAUTHORIZED
      );
    }
    if (!user.isEmailVerified) {
      throw new HttpException(
        { message: 'Unconfirmed Email', errorType: 'UNCONFIRMED_EMAIL' },
        HttpStatus.UNAUTHORIZED
      );
    }
    await this.usersService.incrementLoginAttempt(user.id);
    const isValid = await bcrypt.compare(pw, user.password);
    if (!isValid) {
      throw authErrors.INVALID_LOGIN_ATTEMPT;
    }
    await this.usersService.resetLoginAttempt(user.id);
    return user;
  }

  async getAuthToken(user: User): Promise<string> {
    const { jwtValidityHrs, jwtSecret } = configuration();
    const expiresIn = 60 * 60 * jwtValidityHrs;
    const payload: JwtPayload = {
      email: user.email,
      userId: user.id,
      role: user.role
    };
    return jwt.sign(payload, jwtSecret, { expiresIn });
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
