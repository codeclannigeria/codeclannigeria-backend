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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const api_exception_model_1 = require("../shared/models/api-exception.model");
const user_dto_1 = require("../users/models/dto/user.dto");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const auth_dto_1 = require("./models/dto/auth.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(_, req) {
        req.user;
        return this.authService.login(req.user);
    }
    async getProfile(req) {
        const u = req.user;
        const user = await this.authService.getProfileAsync(u && u['email']);
        return class_transformer_1.plainToClass(user_dto_1.UserDto, user, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
        });
    }
};
__decorate([
    common_1.Post('login'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    swagger_1.ApiUnauthorizedResponse({ type: api_exception_model_1.ApiException }),
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./models/dto/auth.dto").AuthResDto }),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthReqDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Get('profile'),
    openapi.ApiResponse({ status: 200, type: require("../users/models/dto/user.dto").UserDto }),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    swagger_1.ApiTags('Auth'),
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map