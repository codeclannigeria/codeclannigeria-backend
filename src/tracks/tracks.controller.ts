import {
  BadRequestException,
  Body,
  ConflictException,
  HttpStatus,
  Post,
  Req,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseCrudController } from '~shared/controllers/base.controller';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';
import { BufferedFile } from '~shared/interfaces';
import { uploadImg } from '~shared/utils/upload-img.util';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UserRole } from '../users/models/user.entity';
import { CreateTrackDto, CreateWithThumbnailTrackDto } from './models/dto/create-track.dto';
import { PagedTrackOutputDto, TrackDto } from './models/dto/tack.dto';
import { Track } from './models/track.entity';
import { TracksService } from './tracks.service';

const BaseCtrl = BaseCrudController<Track, TrackDto, CreateTrackDto>({
  entity: Track,
  entityDto: TrackDto,
  createDto: CreateTrackDto,
  updateDto: CreateTrackDto,
  pagedListDto: PagedTrackOutputDto,
  auth: {
    update: [UserRole.ADMIN, UserRole.MENTOR],
    delete: [UserRole.ADMIN, UserRole.MENTOR]
  }
});
const ONE_KB = 1024;
export class TracksController extends BaseCtrl {
  constructor(protected trackService: TracksService) {
    super(trackService);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiResponse({ type: TrackDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async create(@Body() input: CreateTrackDto): Promise<TrackDto> {
    const exist = await this.trackService.findOneAsync({
      title: input.title.toUpperCase()
    });
    if (exist)
      throw new ConflictException(
        `Track with the title "${exist.title}" already exists`
      );
    return await super.create(input);
  }

  @Post("create_with_thumbnail")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiResponse({ type: TrackDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @UseInterceptors(FileInterceptor("thumbnail"))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  async createTrack(@Body() input: CreateWithThumbnailTrackDto, @UploadedFile() thumbnail: BufferedFile, @Req() req: Request): Promise<TrackDto> {
    if (!thumbnail)
      throw new BadRequestException("Thumbnail image cannot be empty")

    if (thumbnail.mimetype.split('/')[0] !== "image")
      throw new UnsupportedMediaTypeException("File is not an image");
    if (thumbnail.size / ONE_KB > 200)
      throw new BadRequestException("File cannot be larger than 200KB")


    const exist = await this.trackService.findOneAsync({
      title: input.title.toUpperCase()
    });
    if (exist)
      throw new ConflictException(
        `Track with the title "${exist.title}" already exists`
      );
    const userId = req.user['userId'];

    const thumbnailUrl = await uploadImg(thumbnail, "avatars", userId);
    const dto = input as any;
    dto.thumbnailUrl = thumbnailUrl;
    delete dto.thumbnail
    return await super.create(dto);
  }

  // @Post(":trackId/enroll")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.MENTEE)
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  // @ApiBearerAuth()
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  // async enroll(@Param("trackId") trackId: string): Promise<UserDto> {
  //   const track = await this.trackService.findByIdAsync(trackId);
  //   if (!track) throw new NotFoundException(`Track with ${trackId} not found`);
  //   const user = await this.trackService.enroll(track.id);
  //   return plainToClass(UserDto, user, {
  //     enableImplicitConversion: true,
  //     excludeExtraneousValues: true
  //   });
  // }
}
