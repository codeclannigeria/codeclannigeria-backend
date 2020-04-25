import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiException } from '../shared/models/api-exception.model';
import { PagedReqDto } from '../shared/models/dto/paged-req.dto';
import { AbstractCrudController } from '../shared/base.controller';
import { CreateUserDto } from './models/dto/create-user.dto';
import { PagedUserResDto } from './models/dto/paged-user.dto';
import { UserDto } from './models/dto/user.dto';
import { User } from './models/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController extends AbstractCrudController<
  User,
  UserDto,
  CreateUserDto
>({
  entity: User,
  entityDto: UserDto,
  createDto: CreateUserDto,
}) {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    const user = this.usersService.createEntity(createUserDto);
    await this.usersService.insertAsync(user);
    return user.id;
  }

  @Get()
  @ApiOkResponse({ type: PagedUserResDto })
  @ApiBadRequestResponse({ type: ApiException })
  async findAll(@Query() query: PagedReqDto) {
    const { skip, limit, search } = query;
    const entities = await this.usersService
      .findAll(search && { $text: { $search: search } })
      .limit(limit)
      .skip(skip);
    const totalCount = await this.usersService.countAsync();
    const items = plainToClass(UserDto, entities, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return { totalCount, items };
  }
}
