import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AbstractCrudController } from '~shared/base.controller';
import { ApiException } from '~shared/models/api-exception.model';
import { PagedResDto } from '~shared/models/dto/paged-res.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTrackDto } from './models/dto/create-track.dto';
import { TrackDto } from './models/dto/tack.dto';
import { Track } from './models/track.entity';
import { TracksService } from './tracks.service';

@Controller('tracks')
@ApiTags('tracks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TracksController extends AbstractCrudController<
  Track,
  TrackDto,
  CreateTrackDto,
  CreateTrackDto
>({
  entity: Track,
  entityDto: TrackDto,
  createDto: CreateTrackDto,
  updateDto: CreateTrackDto,
  pagedResDto: PagedResDto(TrackDto)
}) {
  constructor(private readonly trackService: TracksService) {
    super(trackService);
  }

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
