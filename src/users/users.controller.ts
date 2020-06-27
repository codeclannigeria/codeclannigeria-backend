import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { BaseCrudController } from '../shared/controllers/base.controller';
import { CreateUserDto } from './models/dto/create-user.dto';
import { PagedUserOutputDto, UserDto } from './models/dto/user.dto';
import { User, UserRole } from './models/user.entity';
import { UsersService } from './users.service';

const BaseCtrl = BaseCrudController<User, UserDto, CreateUserDto>({
  entity: User,
  entityDto: UserDto,
  createDto: CreateUserDto,
  updateDto: CreateUserDto,
  pagedListDto: PagedUserOutputDto,
  auth: {
    find: [UserRole.ADMIN],
    findById: [UserRole.ADMIN],
    update: [UserRole.ADMIN],
    delete: [UserRole.ADMIN]
  }
});

export class UsersController extends BaseCtrl {
  constructor(protected readonly usersService: UsersService) {
    super(usersService);
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({ type: UserDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiBearerAuth()
  async create(@Body() input: CreateUserDto): Promise<UserDto> {
    const exist = await this.usersService.findOneAsync({
      title: input.email.toLowerCase()
    });
    if (exist)
      throw new ConflictException(
        `User with the email "${exist.email}" already exists`
      );
    return super.create(input);
  }
}
