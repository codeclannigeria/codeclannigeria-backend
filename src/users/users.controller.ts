import {
  Body,
  ConflictException,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';
import { FindDto, IPagedListDto } from '~shared/models/dto';

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
    if (exist) {
      throw new ConflictException(
        `User with the email "${exist.email}" already exists`
      );
    }
    return super.create(input);
  }
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({ type: PagedUserOutputDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  async findAll(@Query() query: FindDto): Promise<IPagedListDto<UserDto>> {
    const { skip, limit, search, opts } = query;
    const { conditions, options } = this.getConditions(search, opts);
    const entities = await this.usersService
      .findAll(conditions, options)
      .populate('tracks')
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    const totalCount = await this.usersService.countAsync();
    const items = plainToClass(UserDto, entities, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true
    }) as any;
    return { totalCount, items };
  }

  private getConditions(search: string, opts: string) {
    const conditions = JSON.parse(search || '{}');
    const options = JSON.parse(opts || '{}');

    if (options?.sort) {
      const sort = { ...options.sort };
      Object.keys(sort).map((key) => {
        if (sort[key] === 'ascend') sort[key] = 1;
        else sort[key] = -1;
        return sort;
      });
      options.sort = sort;
    }
    return { conditions, options };
  }
}
