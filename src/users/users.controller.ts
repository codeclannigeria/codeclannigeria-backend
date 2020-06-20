import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BaseCrudController } from '../shared/controllers/base.controller';
import { Roles } from '../shared/decorators/roles.decorator';
import { CreateUserDto } from './models/dto/create-user.dto';
import { PagedUserOutputDto, UserDto } from './models/dto/user.dto';
import { User, UserRole } from './models/user.entity';

@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController extends BaseCrudController<
  User,
  UserDto,
  CreateUserDto
>({
  entity: User,
  entityDto: UserDto,
  createDto: CreateUserDto,
  updateDto: UserDto,
  pagedOutputDto: PagedUserOutputDto,
  auth: true
}) {}
