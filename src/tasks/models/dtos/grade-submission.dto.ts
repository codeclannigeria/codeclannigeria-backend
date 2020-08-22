import { PickType } from '@nestjs/swagger';

import { SubmissionDto } from './submission.dto';

export class GradeSubmissionDto extends PickType(SubmissionDto, ['gradePercentage', 'mentorComment', 'id']) { }