import { Request } from 'express';
import { UserDto } from 'src/users/models/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthReqDto } from './models/dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(_: AuthReqDto, req: Request): Promise<import("./models/dto/auth.dto").AuthResDto>;
    getProfile(req: Request): Promise<UserDto>;
}
