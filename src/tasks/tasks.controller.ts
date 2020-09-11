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
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CoursesService } from '../courses/courses.service';
import { StagesService } from '../stages/stages.service';
import { TracksService } from '../tracks/tracks.service';
import { UserRole } from '../users/models/user.entity';
import { CreateSubmissionDto } from './models/dtos/create-subission.dto';
import { CreateTaskDto } from './models/dtos/create-task.dto';
import {
  PagedListSubmissionDto,
  SubmissionDto
} from './models/dtos/submission.dto';
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
    @Inject(CoursesService)
    private coursesService: CoursesService
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
    const course = await this.coursesService.findByIdAsync(input.course);
    if (!course)
      throw new NotFoundException(`Course with ${input.course} not found`);
    return await super.create(input);
  }

  @Get(':taskId/submissions')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: PagedListSubmissionDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getMentors(
    @Param('taskId') taskId: string
  ): Promise<PagedListSubmissionDto> {
    const task = await this.tasksService.findByIdAsync(taskId);
    if (!task) throw new NotFoundException(`Task with Id ${taskId} not found`);
    const submissions = await this.tasksService.getUserSubmissions(taskId);

    const items = plainToClass(SubmissionDto, submissions, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    return { totalCount: submissions.length, items };
  }

  @Post(':taskId/submissions')
  @ApiResponse({ type: SubmissionDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async submitTask(
    @Param('taskId') taskId: string,
    @Body() input: CreateSubmissionDto
  ): Promise<SubmissionDto> {
    const task = await this.tasksService.findByIdAsync(taskId);
    if (!task) throw new NotFoundException(`Track with ${taskId} not found`);

    const submission = await this.tasksService.submitTask(input, task);
    return plainToClass(SubmissionDto, submission, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    });
  }
}
