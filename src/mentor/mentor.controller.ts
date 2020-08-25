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
    UseGuards,
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
import { PagedListSubmissionDto, SubmissionDto } from '../tasks/models/dtos/submission.dto';
import { Submission } from '../tasks/models/submission.entity';
import { UserRole } from '../users/models/user.entity';

@Controller('mentors')
@ApiTags("Mentors")
export class MentorController {
    constructor(
        @InjectModel(Submission.modelName)
        private SubmissionModel: ReturnModelType<typeof Submission>) {
    }
    @Get('submissions')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: PagedListSubmissionDto })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async getSubmissions(@Query() query: FindDto, @Req() req: Request): Promise<PagedListSubmissionDto> {
        const { skip, limit, search, opts } = query;
        const conditions = JSON.parse(search || '{}');
        const options = JSON.parse(opts || '{}');
        const mentorId = req.user['userId'];

        const submissions = await this.SubmissionModel
            .find({ ...conditions, mentor: mentorId }, options)
            .limit(limit)
            .skip(skip);

        const totalCount = await this.SubmissionModel.countDocuments();
        const items = plainToClass(SubmissionDto, submissions, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        }) as any;

        return { totalCount, items };
    }

    @Post('grade/:submissionId')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async gradeTask(@Param("submissionId") submissionId: string, @Body() input: GradeSubmissionDto, @Req() req: Request): Promise<void> {
        const submission = await this.SubmissionModel.findById(submissionId);
        if (!submission)
            throw new NotFoundException(`Submission with the id ${submissionId} not found`);
        const userId = req.user["userId"];
        await this.SubmissionModel.updateOne({ _id: submissionId }, { ...input, updatedBy: userId })
    }
}
