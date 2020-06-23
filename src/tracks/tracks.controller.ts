import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { BaseCrudController } from '~shared/controllers/base.controller';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

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
  pagedEntityOutputDto: PagedTrackOutputDto,
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
  @ApiResponse({ type: TrackDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async create(@Body() input: CreateTrackDto): Promise<TrackDto> {
    const exist = await this.trackService.findOneAsync({
      title: input.title.toUpperCase()
    });
    if (exist)
      throw new ConflictException(
        `Track with the title "${exist.title}" already exists`
      );
    return super.create(input);
  }
}
