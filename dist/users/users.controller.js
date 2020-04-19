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
const base_controller_1 = require("./../shared/base.controller");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("./models/dto/user.dto");
const users_service_1 = require("./users.service");
const class_transformer_1 = require("class-transformer");
const create_user_dto_1 = require("./models/dto/create-user.dto");
const paged_dto_1 = require("../shared/models/dto/paged.dto");
let UsersController = class UsersController extends base_controller_1.BaseController {
    constructor(usersService) {
        super(usersService);
        this.usersService = usersService;
    }
    async findAll(query) {
        const { skip, limit, search } = query;
        const users = await this.usersService
            .findAll(search && { $text: { $search: search } })
            .limit(limit)
            .skip(skip);
        const items = class_transformer_1.plainToClass(user_dto_1.UserDto, users, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true,
        });
        return { totalCount: limit, items };
    }
    async create(createUserDto) {
        const user = this.usersService.createEntity(createUserDto);
        await this.usersService.insertAsync(user);
        return user.id;
    }
};
__decorate([
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: require("./models/dto/paged.dto").PagedUserResDto }),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paged_dto_1.PagedReqDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    common_1.Post(),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: String }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
UsersController = __decorate([
    swagger_1.ApiTags('Users'),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map