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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const api_exception_model_1 = require("../shared/models/api-exception.model");
const paged_req_dto_1 = require("../shared/models/dto/paged-req.dto");
const base_controller_1 = require("../shared/base.controller");
const create_user_dto_1 = require("./models/dto/create-user.dto");
const paged_user_dto_1 = require("./models/dto/paged-user.dto");
const user_dto_1 = require("./models/dto/user.dto");
const user_entity_1 = require("./models/user.entity");
const users_service_1 = require("./users.service");
let UsersController = class UsersController extends base_controller_1.AbstractCrudController({
    entity: user_entity_1.User,
    entityDto: user_dto_1.UserDto,
    createDto: create_user_dto_1.CreateUserDto,
}) {
    constructor(usersService) {
        super(usersService);
        this.usersService = usersService;
    }
    async create(createUserDto) {
        const user = this.usersService.createEntity(createUserDto);
        await this.usersService.insertAsync(user);
        return user.id;
    }
    async findAll(query) {
        const { skip, limit, search } = query;
        const entities = await this.usersService
            .findAll(search && { $text: { $search: search } })
            .limit(limit)
            .skip(skip);
        const totalCount = await this.usersService.countAsync();
        const items = class_transformer_1.plainToClass(user_dto_1.UserDto, entities, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
        });
        return { totalCount, items };
    }
};
__decorate([
    common_1.Post(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: String }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    common_1.Get(),
    swagger_1.ApiOkResponse({ type: paged_user_dto_1.PagedUserResDto }),
    swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paged_req_dto_1.PagedReqDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
UsersController = __decorate([
    swagger_1.ApiTags('Users'),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map