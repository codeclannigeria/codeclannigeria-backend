import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers/base.controller';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors/api-exception';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/models/user.entity';
import { CreateTrackDto } from './models/dto/create-track.dto';
import { PagedTrackOutputDto, TrackDto } from './models/dto/tack.dto';
import { Track } from './models/track.entity';
import { TracksService } from './tracks.service';

export class TracksController extends BaseCrudController<
  Track,
  TrackDto,
  CreateTrackDto,
  CreateTrackDto
>({
  entity: Track,
  entityDto: TrackDto,
  createDto: CreateTrackDto,
  updateDto: CreateTrackDto,
  pagedOutputDto: PagedTrackOutputDto,
  auth: {
    update: [UserRole.ADMIN, UserRole.MENTOR],
    delete: [UserRole.ADMIN, UserRole.MENTOR]
  }
}) {
  /**
   *
   */
  // constructor(protected service: TracksService) {
  //   super(service);
  // }
  @Post()
  @ApiResponse({ type: TrackDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async create(@Body() input: CreateTrackDto): Promise<TrackDto> {
    const exist = await this.service.findOneAsync({ title: input.title });
    if (exist)
      throw new ConflictException('Track with the title already exists');

    return super.create(input);
  }
}
