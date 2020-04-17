import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './models/dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return '';
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createEntity(createUserDto);
  }
}
