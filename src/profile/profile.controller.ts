import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto } from '../users/models/dto/user.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Req() req: Request): Promise<UserDto> {
    const user = await this.profileService.getProfileAsync(req.user['email']);
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
