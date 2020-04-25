import { PagedReqDto } from '../shared/models/dto/paged-req.dto';
import { CreateUserDto } from './models/dto/create-user.dto';
import { UserDto } from './models/dto/user.dto';
import { UsersService } from './users.service';
declare const UsersController_base: any;
export declare class UsersController extends UsersController_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<string>;
    findAll(query: PagedReqDto): Promise<{
        totalCount: number;
        items: UserDto[];
    }>;
}
export {};
