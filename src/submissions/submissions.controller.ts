import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSubmissionDto } from '~/tasks/models/dtos/create-subission.dto';
import {
  PagedListSubmissionDto,
  SubmissionDto
} from '~/tasks/models/dtos/submission.dto';
import { Submission } from '~/tasks/models/submission.entity';
import { UserRole } from '~/users/models/user.entity';
import { BaseCrudController } from '~shared/controllers';

import { SubmissionsService } from './submissions.service';

const BaseCtrl = BaseCrudController<
  Submission,
  SubmissionDto,
  CreateSubmissionDto
>({
  entity: Submission,
  createDto: CreateSubmissionDto,
  pagedListDto: PagedListSubmissionDto,
  entityDto: SubmissionDto,
  updateDto: CreateSubmissionDto,
  auth: {
    update: [UserRole.ADMIN],
    delete: [UserRole.ADMIN],
    create: [UserRole.ADMIN],
    find: [UserRole.ADMIN],
    findById: [UserRole.ADMIN]
  }
});

@Controller('submissions')
@ApiTags('Submissions')
export class SubmissionsController extends BaseCtrl {
  constructor(protected submissionService: SubmissionsService) {
    super(submissionService);
  }
}
