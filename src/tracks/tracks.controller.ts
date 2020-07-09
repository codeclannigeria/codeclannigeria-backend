import { UserDto } from './../users/models/dto/user.dto';
import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards,
  HttpCode,
  Param,
  NotFoundException
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers/base.controller';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UserRole } from '../users/models/user.entity';
import { CreateTrackDto } from './models/dto/create-track.dto';
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
  // @Post(":trackId/enroll")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.MENTEE)
  //   @HttpCode(HttpStatus.OK)
  // @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  // @ApiBearerAuth()
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  // async enroll(@Param("trackId") trackId: string): Promise<void> {
  //   const tracks = await this.trackService.getAssignedtracks();
  //   const track = tracks.find((x) => x.id === trackId);
  //   if (!track) throw new NotFoundException(`Track with ${trackId} not found`);
  //   await this.trackService.enroll(track);
  // }
}
