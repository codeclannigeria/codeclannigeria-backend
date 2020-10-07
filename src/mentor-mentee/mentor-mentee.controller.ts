import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MentorMentee } from '~/mentor/models/mentor-mentee.entity';
import { UserRole } from '~/users/models/user.entity';
import { BaseCrudController } from '~shared/controllers';
import {
  CreateMentorMenteeDto,
  MentorMenteeDto,
  PagedMentorMenteeDto
} from './dto/mentor-mentee.dto';

const BaseCtrl = BaseCrudController<
  MentorMentee,
  MentorMenteeDto,
  CreateMentorMenteeDto,
  MentorMenteeDto
>({
  entity: MentorMentee,
  createDto: CreateMentorMenteeDto,
  pagedListDto: PagedMentorMenteeDto,
  entityDto: MentorMenteeDto,
  updateDto: MentorMenteeDto,
  auth: {
    update: [UserRole.ADMIN],
    delete: [UserRole.ADMIN],
    create: [UserRole.ADMIN],
    find: [UserRole.ADMIN],
    findById: [UserRole.ADMIN]
  }
});

@Controller('mentor-mentee')
@ApiTags('MentorMentee')
export class MentorMenteeController extends BaseCtrl {}
