"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../users/models/user.entity");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pw) {
        const user = await this.usersService.findOneAsync({ email });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid login attempt');
        try {
            const isValid = await bcrypt.compare(pw, user.password);
            if (!isValid)
                throw new common_1.UnauthorizedException('Invalid login attempt');
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid login attempt');
        }
        return user;
    }
    login(user) {
        const expiresIn = 60 * 60 * 60 * 24;
        const payload = {
            email: user.email,
            userId: user.id,
            userRole: user.role,
        };
        const result = this.jwtService.sign(payload, { expiresIn });
        return {
            accessToken: result,
            expireInSeconds: expiresIn,
            userId: user.id,
        };
    }
    async getProfileAsync(email) {
        return this.usersService.findOneAsync({ email });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map