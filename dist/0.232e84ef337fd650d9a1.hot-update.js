exports.id = 0;
exports.modules = {

/***/ "./src/users/users.controller.ts":
/***/ (function(module, exports, __webpack_require__) {

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
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const base_controller_1 = __webpack_require__("./src/shared/base.controller.ts");
const create_user_dto_1 = __webpack_require__("./src/users/models/dto/create-user.dto.ts");
const user_dto_1 = __webpack_require__("./src/users/models/dto/user.dto.ts");
const users_service_1 = __webpack_require__("./src/users/users.service.ts");
const user_entity_1 = __webpack_require__("./src/users/models/user.entity.ts");
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
};
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


/***/ })

};