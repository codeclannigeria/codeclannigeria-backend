import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';
import { FindDto } from '~shared/models/dto';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { GradeSubmissionDto } from '../tasks/models/dtos/grade-submission.dto';
import {
  PagedListSubmissionDto,
  SubmissionDto
} from '../tasks/models/dtos/submission.dto';
import { Submission } from '../tasks/models/submission.entity';
import { UserRole } from '../users/models/user.entity';
import { MentorService } from './mentor.service';

@Controller('mentors')
@ApiTags('Mentors')
export class MentorController {
  constructor(
    @InjectModel(Submission.modelName)
    private SubmissionModel: ReturnModelType<typeof Submission>,
    private mentorService: MentorService
  ) {}
  @Get('submissions')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: PagedListSubmissionDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async getSubmissions(
    @Query() query: FindDto,
    @Req() req: Request
  ): Promise<PagedListSubmissionDto> {
    const { skip, limit, search, opts } = query;
    const conditions = search && JSON.parse(search);
    const options = opts && JSON.parse(opts);
    const mentorId = req.user['userId'];
    const submissions = await this.SubmissionModel.find(
      { ...conditions, mentor: mentorId },
      null,
      { ...options, limit, skip }
    );

    const items = plainToClass(SubmissionDto, submissions, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    const totalCount = await this.mentorService.countSubmissions(mentorId);
    return { totalCount, items };
  }

  @Post('grade/:submissionId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async gradeTask(
    @Param('submissionId') submissionId: string,
    @Body() input: GradeSubmissionDto,
    @Req() req: Request
  ): Promise<void> {
    const mentorId = req.user['userId'];

    const submission = await this.SubmissionModel.findOne({
      _id: submissionId,
      mentor: mentorId
    });
    if (!submission)
      throw new NotFoundException(
        `Submission with the id ${submissionId} not found`
      );
    await this.SubmissionModel.updateOne(
      { _id: submissionId },
      { ...input, updatedBy: mentorId }
    );
  }
}
