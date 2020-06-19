import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PagedResDto } from '~shared/models/dto/paged-res.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AbstractCrudController } from '../shared/base.controller';
import { CreateUserDto } from './models/dto/create-user.dto';
import { UserDto } from './models/dto/user.dto';
import { User } from './models/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController extends AbstractCrudController<
  User,
  UserDto,
  CreateUserDto
>({
  entity: User,
  entityDto: UserDto,
  createDto: CreateUserDto,
  updateDto: UserDto,
  pagedResDto: PagedResDto(UserDto)
}) {
  constructor(protected readonly usersService: UsersService) {
    super(usersService);
  }
}
