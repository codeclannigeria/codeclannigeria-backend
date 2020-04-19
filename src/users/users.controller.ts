import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractCrudController } from './../shared/base.controller';
import { CreateUserDto } from './models/dto/create-user.dto';
import { UserDto } from './models/dto/user.dto';
import { UsersService } from './users.service';
import { User } from './models/user.entity';

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

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async create(@Body() createUserDto: CreateUserDto): Promise<string> {
  //   const user = this.usersService.createEntity(createUserDto);
  //   await this.usersService.insertAsync(user);
  //   return user.id;
  // }
}
