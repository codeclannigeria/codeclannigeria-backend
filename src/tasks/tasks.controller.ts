import { TracksService } from './../tracks/tracks.service';
import { StagesService } from './../stages/stages.service';
import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards,
  NotFoundException,
  Inject
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UserRole } from '../users/models/user.entity';
import { CreateTaskDto } from './models/dtos/create-task.dto';
import { PagedListTaskDto, TaskDto } from './models/dtos/task.dto';
import { Task } from './models/task.entity';
import { TasksService } from './tasks.service';

const BaseCtrl = BaseCrudController<Task, TaskDto, CreateTaskDto>({
  entity: Task,
  createDto: CreateTaskDto,
  pagedListDto: PagedListTaskDto,
  entityDto: TaskDto,
  updateDto: CreateTaskDto,
  auth: true
});

export class TasksController extends BaseCtrl {
  constructor(
    private tasksService: TasksService,
    @Inject(StagesService)
    private stageService: StagesService,
    @Inject(TracksService)
    private trackService: TracksService
  ) {
    super(tasksService);
  }

  @Post()
  @ApiResponse({ type: TaskDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async create(@Body() input: CreateTaskDto): Promise<TaskDto> {
    const task = await this.tasksService.findOneAsync({
      title: input.title.toUpperCase()
    });
    if (task) {
      throw new ConflictException(
        `Task with the title "${task.title}" already exists`
      );
    }
    const stage = await this.stageService.findByIdAsync(input.stage);
    if (!stage)
      throw new NotFoundException(`Stage with ${input.stage} not found`);
    const track = await this.trackService.findByIdAsync(input.track);
    if (!track)
      throw new NotFoundException(`Track with ${input.track} not found`);
    return await super.create(input);
  }
}
