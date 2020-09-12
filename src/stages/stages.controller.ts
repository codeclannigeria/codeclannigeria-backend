import {
  Body,
  ConflictException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';
import { FindDto } from '~shared/models/dto';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { PagedListTaskDto, TaskDto } from '../tasks/models/dtos/task.dto';
import { TasksService } from '../tasks/tasks.service';
import { TracksService } from '../tracks/tracks.service';
import { UserRole } from '../users/models/user.entity';
import { CreateStageDto } from './models/dtos/create-stage.dto';
import { PagedListStageDto, StageDto } from './models/dtos/stage.dto';
import { Stage } from './models/stage.entity';
import { StagesService } from './stages.service';

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
    private trackService: TracksService,
    @Inject(TasksService)
    private taskService: TasksService
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
  @Get(':stageId/tasks')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: PagedListTaskDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getStages(
    @Param('stageId') stageId: string,
    @Query() query: FindDto
  ): Promise<PagedListTaskDto> {
    const stage = await this.stageService.findByIdAsync(stageId);

    if (!stage)
      throw new NotFoundException(`stage with Id ${stageId} not found`);

    const { skip, limit, search, opts } = query;
    const conditions = search && JSON.parse(search);
    const options = opts && JSON.parse(opts);

    const tasks = await this.taskService.findAll(
      { ...conditions, stage: stageId },
      { ...options, limit, skip }
    );
    const totalCount = await this.taskService.countAsync({ stage: stageId });
    const items = plainToClass(TaskDto, tasks, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    return { totalCount, items };
  }
}
