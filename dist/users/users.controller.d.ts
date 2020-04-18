import { PagedReqDto } from '../shared/models/dto/paged.dto';
import { CreateUserDto } from './models/dto/create-user.dto';
import { PagedUserResDto } from './models/dto/paged.dto';
import { UserDto } from './models/dto/user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(query: PagedReqDto): Promise<PagedUserResDto>;
    createUser(createUserDto: CreateUserDto): Promise<UserDto>;
}
