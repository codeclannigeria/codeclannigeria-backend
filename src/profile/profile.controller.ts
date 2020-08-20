import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { BufferedFile } from '~shared/interfaces';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MentorService } from '../mentor/mentor.service';
import { PagedUserOutputDto, UserDto } from '../users/models/dto/user.dto';
import { UsersService } from '../users/users.service';
import { MentorDto } from './../mentor/models/mentor.dto';
import { AvatarUploadDto } from './dto/avatar-upload.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags("Profile")
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UsersService, private profileService: ProfileService, private mentorService: MentorService) { }
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  async getProfile(@Req() req: Request): Promise<UserDto> {
    let user = await this.userService.findById(req.user['userId'])

    if (user.tracks.length > 0)
      user = await user.populate('tracks').execPopulate()
    //get the stage for each of the tracks above
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }
  @Get("mentors")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: PagedUserOutputDto, status: HttpStatus.OK })
  async getMentors(@Req() req: Request): Promise<PagedUserOutputDto> {
    const mentors = await this.mentorService.getMentors(req.user['userId']);

    const items = plainToClass(MentorDto, mentors, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    return { totalCount: mentors.length, items }
  }
  @Get("mentees")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: PagedUserOutputDto, status: HttpStatus.OK })
  async getMentees(@Req() req: Request): Promise<PagedUserOutputDto> {
    const mentors = await this.mentorService.getMentees(req.user['userId']);

    const items = plainToClass(MentorDto, mentors, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    return { totalCount: mentors.length, items }
  }
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  async updateProfile(@Body() input: UpdateProfileDto, @Req() req: Request): Promise<UserDto> {
    const id = req.user['userId'];
    const user = await this.userService.updateAsync(id, input);
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
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
  async uploadFile(@UploadedFile() file: BufferedFile, @Req() req: Request): Promise<UserDto> {
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
