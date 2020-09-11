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
  Query
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
import { MentorDto } from '../mentor/models/mentor.dto';
import { PagedListStageDto, StageDto } from '../stages/models/dtos/stage.dto';
import { PagedUserOutputDto } from '../users/models/dto/user.dto';
import { UserRole } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import {
  CreateTrackDto,
  CreateWithThumbnailTrackDto,
  MentorInput
} from './models/dto/create-track.dto';
import { PagedTrackOutputDto, TrackDto } from './models/dto/track.dto';
import { Track } from './models/track.entity';
import { TracksService } from './tracks.service';
import {
  UserStageDto,
  PagedUserStageDto
} from '../userstage/models/dto/userstage.dto';
import { UserStageService } from '../userstage/userstage.service';
import { FindDto } from '~shared/models/dto';

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
    protected userService: UsersService,
    protected userStageService: UserStageService
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

  @Post('create_with_thumbnail')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiResponse({ type: TrackDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  async createTrack(
    @Body() input: CreateWithThumbnailTrackDto,
    @UploadedFile() thumbnail: BufferedFile,
    @Req() req: Request
  ): Promise<TrackDto> {
    if (!thumbnail)
      throw new BadRequestException('Thumbnail image cannot be empty');
    if (thumbnail.mimetype.split('/')[0] !== 'image')
      throw new UnsupportedMediaTypeException('File is not an image');
    if (thumbnail.size / ONE_KB > 200)
      throw new BadRequestException('File cannot be larger than 200KB');
    const exist = await this.trackService.findOneAsync({
      title: input.title.toUpperCase()
    });
    if (exist)
      throw new ConflictException(
        `Track with the title "${exist.title}" already exists`
      );

    const userId = req.user['userId'];
    const thumbnailUrl = await uploadFileToCloud(thumbnail, 'avatars', userId);
    const dto = input as any;
    dto.thumbnailUrl = thumbnailUrl;
    delete dto.thumbnail;
    return await super.create(dto);
  }
  @Get('/:trackId/my_stages')
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiBearerAuth()
  @ApiResponse({ type: PagedUserStageDto, status: HttpStatus.OK })
  async getMyStages(
    @Param('trackId') trackId: string,
    @Query() query: FindDto,
    @Req() req: Request
  ): Promise<PagedUserStageDto> {
    const { skip, limit, search, opts } = query;
    const conditions = search && JSON.parse(search);
    const options = opts && JSON.parse(opts);
    const userId = req.user['userId'];
    const userStages = await this.userStageService
      .findAll(
        { ...conditions, user: userId, track: trackId },
        { ...options, limit, skip }
      )
      .populate({ path: 'stage' });

    const items = plainToClass(UserStageDto, userStages, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    const totalCount = await this.userStageService.countAsync({ user: userId });
    return { totalCount, items };
  }
  @Get(':trackId/stages')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: PagedListStageDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getStages(
    @Param('trackId') trackId: string
  ): Promise<PagedListStageDto> {
    const track = await this.trackService.findByIdAsync(trackId);

    if (!track)
      throw new NotFoundException(`Track with Id ${trackId} not found`);

    const stages = await this.trackService.getStages(trackId);
    const totalCount = stages.length;
    const items = plainToClass(StageDto, stages, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    return { totalCount, items };
  }

  // @Get(':trackId/user_stages')
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({ status: HttpStatus.OK, type: PagedListStageDto })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  // async getUserStages(
  //   @Param('trackId') trackId: string
  // ): Promise<PagedListStageDto> {
  //   const track = await this.trackService.findByIdAsync(trackId);
  //   if (!track)
  //     throw new NotFoundException(`Track with Id ${trackId} not found`);
  //   const userStages = await this.userStageService.getUserStages(trackId);

  //   const totalCount = userStages.length;
  //   const items = plainToClass(UserStageDto, userStages, {
  //     enableImplicitConversion: true,
  //     excludeExtraneousValues: true
  //   }) as any;
  //   return { totalCount, items };
  // }
  @Get(':trackId/mentors')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: PagedUserOutputDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getMentors(
    @Param('trackId') trackId: string
  ): Promise<PagedUserOutputDto> {
    const track = await this.trackService.findByIdAsync(trackId);
    if (!track)
      throw new NotFoundException(`Track with Id ${trackId} not found`);
    const mentors = await this.trackService.getMentors(trackId);
    const items = plainToClass(MentorDto, mentors, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    return { totalCount: mentors.length, items };
  }

  @Post(':trackId/mentors')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async createMentors(
    @Param('trackId') trackId: string,
    @Body() input: MentorInput,
    @Req() req: Request
  ): Promise<void> {
    const mentor = await this.userService.findOneAsync({
      _id: input.mentorId,
      role: UserRole.MENTOR
    });
    if (!mentor)
      throw new NotFoundException(`Mentor with Id ${input.mentorId} not found`);
    const track = await this.trackService.findByIdAsync(trackId);
    if (!track)
      throw new NotFoundException(`Track with Id ${trackId} not found`);

    await this.mentorService.assignMentorToTrack(
      trackId,
      input.mentorId,
      req.user['id']
    );
  }

  @Post(':trackId/enroll')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async enroll(
    @Param('trackId') trackId: string,
    @Body() input: MentorInput,
    @Req() req: Request
  ): Promise<void> {
    const track = await this.trackService.findByIdAsync(trackId);
    if (!track) throw new NotFoundException(`Track with ${trackId} not found`);

    const mentor = await this.userService.findOneAsync({
      _id: input.mentorId,
      role: UserRole.MENTOR
    });
    if (!mentor)
      throw new NotFoundException(`Mentor with ${input.mentorId} not found`);

    await this.mentorService.assignMentor(
      req.user['userId'],
      mentor.id,
      trackId
    );
    await this.trackService.enroll(track.id);
  }
}
