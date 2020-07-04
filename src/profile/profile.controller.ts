import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Req,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto } from '../users/models/dto/user.dto';
import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { AvatarUploadDto } from './dto/avatar-upload.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags("Profile")
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UsersService, private profileService: ProfileService) { }
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  async getProfile(@Req() req: Request): Promise<UserDto> {
    const user = await this.userService.findOneAsync({
      email: req.user['email'].toLowerCase()
    });
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  async updateProfile(@Body() input: UpdateProfileDto, @Req() req: Request): Promise<void> {

    const id = req.user['userId'];
    const user = await this.userService.findByIdAsync(id);
    if (!user)
      throw new NotFoundException(`Entity with Id ${id} does not exist`);
    const value = plainToClass(UserDto, user, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });
    const toBeUpdatedEntity = { ...value, ...input } as Partial<User>;
    await this.userService.updateAsync(id, toBeUpdatedEntity);
  }
  @Post('upload_profile_photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload avatar photo',
    type: AvatarUploadDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async uploadFile(@UploadedFile() file: any, @Req() req: Request): Promise<UserDto> {
    if (!file)
      throw new BadRequestException("File image cannot be empty")

    if (file.mimetype.split('/')[0] !== "image")
      throw new UnsupportedMediaTypeException("File is not an image");

    if (file.size / 1024 > 200)
      throw new BadRequestException("File cannot be larger than 200KB")

    const id = req.user['userId'];
    await this.profileService.uploadAvatar(file, id);
    const user = await this.userService.findByIdAsync(id)

    return plainToClass(UserDto, user, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });
  }
}
