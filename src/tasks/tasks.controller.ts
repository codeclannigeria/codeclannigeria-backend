import {
  Body,
  ConflictException,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { StagesService } from '../stages/stages.service';
import { TracksService } from '../tracks/tracks.service';
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
  auth: {
    update: [UserRole.ADMIN, UserRole.MENTOR],
    delete: [UserRole.ADMIN, UserRole.MENTOR]
  }
});

export class TasksController extends BaseCtrl {
  constructor(
    private tasksService: TasksService,
    @Inject(StagesService)
    private stageService: StagesService,
    @Inject(TracksService)
    private trackService: TracksService,
  ) {
    super(tasksService);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiResponse({ type: TaskDto, status: HttpStatus.CREATED })
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


  @Post(':taskId/submit')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async submitTask(@Param('taskId') taskId: string): Promise<void> {

    const task = await this.tasksService.findByIdAsync(taskId);
    if (!task) throw new NotFoundException(`Track with ${taskId} not found`);
    await this.tasksService.submitTask(task);
  }
}
