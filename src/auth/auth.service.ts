import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientRedis, Transport } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { TokenType } from '../shared/models/temporary-token.entity';
import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { AuthEventEnum } from './models/auth.enums';
import { LoginResDto } from './models/dto/auth.dto';
import { JwtPayload } from './models/jwt-payload';
import { TempTokensService } from './temp-token.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TempTokensService,
    private readonly jwtService: JwtService,
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
    if (!user) throw new UnauthorizedException('Invalid login attempt');
    try {
      const isValid = await bcrypt.compare(pw, user.password);
      if (!isValid) throw new UnauthorizedException('Invalid login attempt');
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException('Invalid login attempt');
    }
    return user;
  }

  login(user: User): LoginResDto {
    const expiresIn = 60 * 60 * 24;
    const payload: JwtPayload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const result = this.jwtService.sign(payload, { expiresIn });
    return {
      accessToken: result,
      expireInSeconds: expiresIn,
      userId: user.id,
    };
  }

  async pub() {
    this.client.emit(AuthEventEnum.UserRegistered, 'email');
  }

  async generateTempToken(
    userId: string,
    type: TokenType,
    expiresInMins: number,
  ) {
    const exist = await this.tokenService.findOneAsync({ user: userId, type });
    if (exist) return;

    const plainToken = randomBytes(64).toString('hex');
    const encryptedToken = await bcrypt.hash(plainToken, 10);
    const token = this.tokenService.createEntity({
      token: encryptedToken,
      expireAt: new Date(new Date().getTime() + expiresInMins * 60000),
      type,
      user: userId as any,
    });
    await this.tokenService.insertAsync(token);
    return plainToken;
  }
  async validateEmailToken(validateEmailInput: {
    userId: string;
    plainToken: string;
  }) {
    const { userId, plainToken } = validateEmailInput;
    const exist = await this.validateToken(userId, TokenType.EMAIL, plainToken);

    const doc = exist.user as User;
    await this.usersService.updateAsync(doc.id, { isEmailVerified: true });
    await this.tokenService.hardDeleteById(exist.id);
  }
  async validatePasswordToken(resetPassInput: {
    userId: string;
    plainToken: string;
    newPassword: string;
  }) {
    const { userId, plainToken, newPassword } = resetPassInput;
    const exist = await this.validateToken(
      userId,
      TokenType.PASSWORD,
      plainToken,
    );
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const doc = exist.user as User;
    await this.usersService.updateAsync(doc.id, { password: passwordHash });
    await this.tokenService.hardDeleteById(exist.id);
  }
  private async validateToken(
    userId: string,
    type: TokenType,
    plainToken: string,
  ) {
    const exist = await this.tokenService
      .findOne({ user: userId, type })
      .populate('user');
    if (!exist) throw new BadRequestException('Token expired');
    try {
      const isValid = await bcrypt.compare(plainToken, exist.token);
      if (!isValid) throw new BadRequestException('Invalid token');
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
    return exist;
  }
}
