import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { PagedListSubmissionDto, SubmissionDto } from 'src/tasks/models/dtos/submission.dto';
import { UserRole } from 'src/users/models/user.entity';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';
import { FindDto } from '~shared/models/dto';

import { Submission } from '../tasks/models/submission.entity';
import { UsersService } from './../users/users.service';
import { MentorService } from './mentor.service';
import { Request } from 'express';

@Controller('mentors')
@ApiTags("Mentors")
export class MentorController {


    constructor(
        @InjectModel(Submission.modelName)
        private SubmissionModel: ReturnModelType<typeof Submission>,
        private mentorService: MentorService,
        private userService: UsersService) {
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

}
