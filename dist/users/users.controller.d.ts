import { CreateUserDto } from './models/dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<string>;
    createUser(createUserDto: CreateUserDto): Promise<import("./models/user.entity").User>;
}
