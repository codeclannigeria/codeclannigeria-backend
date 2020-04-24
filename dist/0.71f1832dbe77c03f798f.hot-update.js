exports.id = 0;
exports.modules = {

/***/ "./src/shared/base.controller.ts":
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
const class_transformer_1 = __webpack_require__("class-transformer");
const api_exception_model_1 = __webpack_require__("./src/shared/models/api-exception.model.ts");
const paged_dto_1 = __webpack_require__("./src/shared/models/dto/paged.dto.ts");
function AbstractCrudController(options) {
    const { entity, entityDto, createDto } = options;
    class BaseController {
        constructor(baseService) {
            this.baseService = baseService;
        }
        async findAll(query) {
            const { skip, limit, search } = query;
            const entities = await this.baseService
                .findAll(search && { $text: { $search: search } })
                .limit(limit)
                .skip(skip);
            const totalCount = entities.length <= limit ? entities.length : limit;
            const items = class_transformer_1.plainToClass(entityDto, entities, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
            return new paged_dto_1.PagedResDto(totalCount, items, entityDto);
        }
        async findById(id) {
            const entity = await this.baseService.findByIdAsync(id);
            if (!entity)
                throw new common_1.NotFoundException(`Entity with id ${id} does not exist`);
            return class_transformer_1.plainToClass(entityDto, entity, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        }
        async create(input) {
            const newEntity = this.baseService.createEntity(input);
            await this.baseService.insertAsync(newEntity);
            return class_transformer_1.plainToClass(createDto, newEntity, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        }
        async delete(id) {
            this.baseService.deleteByIdAsync(id);
        }
        async update(id, input) {
            const existed = await this.baseService.findByIdAsync(id);
            if (!existed)
                throw new common_1.NotFoundException(`Entity with Id ${id} does not exist`);
            const value = class_transformer_1.plainToClass(entity, existed, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
            const updatedDoc = Object.assign(Object.assign({}, value), input);
            console.log(updatedDoc);
            const result = await this.baseService.updateAsync(id, updatedDoc);
            return class_transformer_1.plainToClass(entityDto, result, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        }
    }
    __decorate([
        common_1.Get(),
        swagger_1.ApiOkResponse({}),
        swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Query()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [paged_dto_1.PagedReqDto]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "findAll", null);
    __decorate([
        common_1.Get(':id'),
        swagger_1.ApiOkResponse({ description: 'Entity retrieved successfully.' }),
        swagger_1.ApiNotFoundResponse({
            type: api_exception_model_1.ApiException,
            description: 'Entity does not exist',
        }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "findById", null);
    __decorate([
        common_1.Post(),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.CREATED }),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.FORBIDDEN }),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.BAD_REQUEST }),
        openapi.ApiResponse({ status: 201 }),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "create", null);
    __decorate([
        common_1.Delete(':id'),
        swagger_1.ApiOkResponse(),
        swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "delete", null);
    __decorate([
        common_1.Put(':id'),
        swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException }),
        swagger_1.ApiOkResponse(),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "update", null);
    return BaseController;
}
exports.AbstractCrudController = AbstractCrudController;


/***/ })

};