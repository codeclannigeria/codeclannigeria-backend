import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './models/jwt-payload';
import { User } from 'src/users/models/user.entity';
import { AuthResDto } from './models/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pw: string): Promise<User> {
    const user = await this.usersService.findOneAsync({ email });
    if (!user) throw new UnauthorizedException('Invalid login attempt');
    try {
      const isValid = await bcrypt.compare(pw, user.password);
      if (!isValid) throw new UnauthorizedException('Invalid login attempt');
    } catch (error) {
      throw new UnauthorizedException('Invalid login attempt');
    }
    return user;
  }

  login(user: User): AuthResDto {
    const expiresIn = 60 * 60 * 60 * 24;
    const payload: JwtPayload = {
      email: user.email,
      userId: user.id,
      userRole: user.role,
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
}
