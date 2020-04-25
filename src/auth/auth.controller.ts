import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

import { AuthReqDto } from '../auth/models/dto/auth.dto';
import { ApiException } from '../shared/models/api-exception.model';
import { UserDto } from '../users/models/dto/user.dto';
import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/models/dto/register-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: ApiException })
  @UseGuards(LocalAuthGuard)
  async login(@Body() _: AuthReqDto, @Req() req: Request) {
    req.user;
    return this.authService.login(req.user as User);
  }
  @Post('register')
  async register(@Body() input: RegisterUserDto): Promise<string> {
    const exist = await this.usersService.findOneAsync({ email: input.email });
    if (exist)
      throw new ConflictException('User with the email already exists');
    const user = this.usersService.createEntity(input);
    await this.usersService.insertAsync(user);
    return user.id;
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<UserDto> {
    const user = await this.authService.getProfileAsync(req.user['email']);
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
