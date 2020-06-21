import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BaseCrudController } from '../shared/controllers/base.controller';
import { CreateUserDto } from './models/dto/create-user.dto';
import { PagedUserOutputDto, UserDto } from './models/dto/user.dto';
import { User, UserRole } from './models/user.entity';
import { UsersService } from './users.service';

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
  updateDto: CreateUserDto,
  pagedOutputDto: PagedUserOutputDto,
  auth: {
    create: [UserRole.ADMIN],
    find: [UserRole.ADMIN],
    findById: [UserRole.ADMIN],
    update: [UserRole.ADMIN],
    delete: [UserRole.ADMIN]
  }
}) {
  constructor(protected readonly usersService: UsersService) {
    super(usersService);
  }
}
