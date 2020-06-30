import {
  Body,
  ConflictException,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { TracksService } from '../tracks/tracks.service';
import { UserRole } from '../users/models/user.entity';
import { CreateStageDto } from './models/dtos/create-stage.dto.ts';
import { PagedListStageDto, StageDto } from './models/dtos/stage.dto.ts';
import { Stage } from './models/stage.entity.ts';
import { StagesService } from './stages.service';
import { plainToClass } from 'class-transformer';

const BaseCtrl = BaseCrudController<Stage, StageDto, CreateStageDto>({
  entity: Stage,
  entityDto: StageDto,
  createDto: CreateStageDto,
  updateDto: CreateStageDto,
  pagedListDto: PagedListStageDto,
  auth: {
    update: [UserRole.ADMIN],
    delete: [UserRole.ADMIN]
  }
});

export class StagesController extends BaseCtrl {
  constructor(
    protected stageService: StagesService,
    @Inject(TracksService)
    private trackService: TracksService
  ) {
    super(stageService);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({ type: StageDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiBearerAuth()
  async create(@Body() input: CreateStageDto): Promise<StageDto> {
    const track = await this.trackService.findByIdAsync(input.track);
    if (!track) {
      throw new NotFoundException(
        `Track with id ${input.track} does not exist`
      );
    }

    const stage = await this.stageService.findOneAsync({
      title: input.title.toUpperCase()
    });
    if (stage) {
      throw new ConflictException(
        `Stage with the title "${stage.title}" already exists`
      );
    }
    return await super.create(input);
  }
}
