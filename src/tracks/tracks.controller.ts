import {
  BadRequestException,
  Body,
  ConflictException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { BaseCrudController } from '~shared/controllers/base.controller';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';
import { BufferedFile } from '~shared/interfaces';
import { uploadFileToCloud } from '~shared/utils/upload-img.util';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { MentorService } from '../mentor/mentor.service';
import { StageDto } from '../stages/models/dtos/stage.dto';
import { UserRole } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { CreateTrackDto, CreateWithThumbnailTrackDto, TrackEnrollmentDto } from './models/dto/create-track.dto';
import { PagedTrackOutputDto, TrackDto } from './models/dto/track.dto';
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
  constructor(
    protected trackService: TracksService,
    protected mentorService: MentorService,
    @Inject(UsersService)
    protected userService: UsersService
  ) {
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

    const thumbnailUrl = await uploadFileToCloud(thumbnail, "avatars", userId);
    const dto = input as any;
    dto.thumbnailUrl = thumbnailUrl;
    delete dto.thumbnail
    return await super.create(dto);
  }

  @Get(':trackId/stages')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async assignedTasks(@Param("trackId") trackId: string): Promise<StageDto[]> {
    const track = await this.trackService.findByIdAsync(trackId);
    if (!track) throw new NotFoundException(`Track with Id ${trackId} not found`)
    const stages = await this.trackService.getStages(trackId);

    return plainToClass(StageDto, stages, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });

  }

  @Post(":trackId/enroll")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async enroll(@Param("trackId") trackId: string, @Body() input: TrackEnrollmentDto, @Req() req: Request): Promise<void> {
    const track = await this.trackService.findByIdAsync(trackId);
    if (!track) throw new NotFoundException(`Track with ${trackId} not found`);

    const mentor = await this.userService.findOneAsync({ _id: input.mentorId, role: UserRole.MENTOR })
    if (!mentor) throw new NotFoundException(`Mentor with ${input.mentorId} not found`);

    await this.mentorService.assignMentor(req.user['id'], mentor);
    await this.trackService.enroll(track.id);
  }
}
