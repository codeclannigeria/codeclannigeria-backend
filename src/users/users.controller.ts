import { User } from './models/user.entity';
import { BaseController } from './../shared/base.controller';
import {
  Controller,
  Get,
  Query,
  Post,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './models/dto/user.dto';
import { UsersService } from './users.service';
import { PagedUserResDto } from './models/dto/paged.dto';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './models/dto/create-user.dto';
import { PagedReqDto } from '../shared/models/dto/paged.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController<
  User,
  UserDto,
  CreateUserDto,
  UserDto
> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Get()
  async findAll(@Query() query: PagedReqDto): Promise<PagedUserResDto> {
    const { skip, limit, search } = query;
    const users = await this.usersService
      .findAll(search && { $text: { $search: search } })
      .limit(limit)
      .skip(skip);
    const items = plainToClass(UserDto, users, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
    return { totalCount: limit, items };
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    const user = this.usersService.createEntity(createUserDto);
    await this.usersService.insertAsync(user);
    return user.id;
  }
}
