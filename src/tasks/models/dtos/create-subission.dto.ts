import { PickType } from '@nestjs/swagger';

import { SubmissionDto } from './submission.dto';

export class CreateSubmissionDto extends PickType(SubmissionDto, ['menteeComment', 'taskUrl']) { }