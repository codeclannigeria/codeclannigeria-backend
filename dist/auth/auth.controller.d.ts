/// <reference types="passport" />
import { AuthService } from './auth.service';
import { AuthDto } from './models/dto/auth.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(authDto: AuthDto, req: Request): Promise<{
        accessToken: string;
    }>;
    getProfile(req: Request): Promise<Express.User>;
}
