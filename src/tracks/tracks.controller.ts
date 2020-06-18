import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { AbstractCrudController } from '~shared/base.controller';
import { plainToClass } from 'class-transformer';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTrackDto } from './models/dto/create-track.dto';
import { TrackDto } from './models/dto/tack.dto';
import { Track } from './models/track.entity';
import { TracksService } from './tracks.service';
import { PagedTrackResDto } from './models/dto/paged-track.dto';
import { ApiException } from '~shared/models/api-exception.model';

@Controller('tracks')
@ApiTags('tracks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TracksController extends AbstractCrudController<
  Track,
  TrackDto,
  CreateTrackDto
>({
  entity: Track,
  entityDto: TrackDto,
  createDto: CreateTrackDto
}) {
  constructor(private readonly trackService: TracksService) {
    super(trackService);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() input: CreateTrackDto): Promise<TrackDto> {
    const exist = await this.trackService.findOneAsync({ email: input.title });
    if (exist)
      throw new ConflictException('Track with the title already exists');
    const track = this.trackService.createEntity(input);

    await this.trackService.insertAsync(track);

    return plainToClass(TrackDto, track, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }
  @Get()
  @ApiOkResponse({ type: PagedTrackResDto })
  @ApiBadRequestResponse({ type: ApiException })
  async findAll(@Query() query: string) {
    const { skip, limit, search } = JSON.parse(query);
    const entities = await this.usersService
      .findAll(search && { $text: { $search: search } })
      .limit(limit)
      .skip(skip);
    const totalCount = await this.usersService.countAsync();
    const items = plainToClass(TrackDto, entities, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
    return { totalCount, items };
  }
}
