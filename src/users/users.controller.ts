import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { PagedReqDto } from '../shared/models/dto/paged.dto';
import { CreateUserDto } from './models/dto/create-user.dto';
import { PagedUserResDto } from './models/dto/paged.dto';
import { UserDto } from './models/dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: PagedReqDto): Promise<PagedUserResDto> {
    const { skip, limit } = query;
    const users = await this.usersService
      .findAll()
      .limit(limit)
      .skip(skip);
    const items = plainToClass(UserDto, users, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
    const totalCount = await this.usersService.countAsync();

    return { totalCount, items };
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = this.usersService.createEntity(createUserDto);
    await this.usersService.insertAsync(user);
    return plainToClass(UserDto, user, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
  }
}
