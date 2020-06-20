import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers/base.controller';
import { ApiException } from '~shared/errors/api-exception';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTrackDto } from './models/dto/create-track.dto';
import { PagedTrackOutputDto, TrackDto } from './models/dto/tack.dto';
import { Track } from './models/track.entity';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  auth: true
}) {
  @Post()
  @ApiResponse({ type: CreateTrackDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async create(@Body() input: CreateTrackDto): Promise<TrackDto> {
    const exist = await this.trackService.findOneAsync({ title: input.title });
    if (exist)
      throw new ConflictException('Track with the title already exists');

    return super.create(input);
  }
}
