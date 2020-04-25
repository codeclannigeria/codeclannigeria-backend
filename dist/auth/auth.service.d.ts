import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/models/user.entity';
import { AuthResDto } from './models/dto/auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pw: string): Promise<User>;
    login(user: User): AuthResDto;
    getProfileAsync(email: string): Promise<User>;
}
