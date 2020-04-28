import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientRedis, Transport } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/models/user.entity';

import { UsersService } from '../users/users.service';
import { AuthEventEnum } from './models/auth.enums';
import { LoginResDto } from './models/dto/auth.dto';
import { JwtPayload } from './models/jwt-payload';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
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
    const expiresIn = 60 * 60 * 60 * 24;
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
  async getProfileAsync(email: string): Promise<User> {
    return this.usersService.findOneAsync({ email });
  }

  async pub() {
    this.client.emit(AuthEventEnum.UserRegistered, 'email');
  }
}
