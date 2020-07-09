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
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { StagesService } from '../stages/stages.service';
import { TracksService } from '../tracks/tracks.service';
import { UserRole } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { AssignTasksDto } from './models/dtos/assign-tasks.dto';
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
    @Inject(UsersService)
    private userService: UsersService
  ) {
    super(tasksService);
  }

  @Post()
  @ApiResponse({ type: TaskDto, status: HttpStatus.CREATED })
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

  @Post('assign')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBody({ description: 'Assigns task(s) to a user', type: AssignTasksDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async assignTasks(@Body() input: AssignTasksDto): Promise<void> {
    for (let i = 0; i < input.userIdList.length; i++) {
      const userId = input.userIdList[i];
      const user = await this.userService.findByIdAsync(userId);

      if (!user)
        throw new NotFoundException(`User with Id ${userId} not found`);

      const taskCount = await this.tasksService.countAsync({
        _id: { $in: input.taskIdList }
      });

      if (taskCount !== input.taskIdList.length)
        throw new NotFoundException(`Not all task exist`);

      await this.tasksService.assignTasks(userId, input.taskIdList);

    }

  }
  @Post(':taskId/submit')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async submitTask(@Param('taskId') taskId: string): Promise<void> {

    const tasks = await this.tasksService.getAssignedTasks();
    const task = tasks.find((x) => x.id === taskId);
    if (!task) throw new NotFoundException(`Track with ${taskId} not found`);
    await this.tasksService.submitTask(task);
  }
}
