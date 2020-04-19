import { User } from './models/user.entity';
import { BaseController } from './../shared/base.controller';
import { UserDto } from './models/dto/user.dto';
import { UsersService } from './users.service';
import { PagedUserResDto } from './models/dto/paged.dto';
import { CreateUserDto } from './models/dto/create-user.dto';
import { PagedReqDto } from '../shared/models/dto/paged.dto';
export declare class UsersController extends BaseController<User, UserDto, CreateUserDto, UserDto> {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: PagedReqDto): Promise<PagedUserResDto>;
    create(createUserDto: CreateUserDto): Promise<string>;
}
