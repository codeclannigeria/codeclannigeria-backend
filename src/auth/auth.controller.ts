import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { ApiException } from 'src/shared/models/api-exception.model';
import { UserDto } from 'src/users/models/dto/user.dto';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { User } from '../users/models/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthReqDto } from 'src/auth/models/dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ type: ApiException })
  @UseGuards(LocalAuthGuard)
  async login(@Body() _: AuthReqDto, @Req() req: Request) {
    req.user;
    return this.authService.login(req.user as User);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<UserDto> {
    const u = req.user;
    const user = await this.authService.getProfileAsync(u && u['email']);
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
