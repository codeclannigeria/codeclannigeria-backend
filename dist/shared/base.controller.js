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
const api_exception_model_1 = require("./models/api-exception.model");
const paged_dto_1 = require("./models/dto/paged.dto");
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
        const count = entities.length;
        const items = entities;
        return { totalCount: count <= limit ? count : limit, items };
    }
    async findById(id) {
        const entity = await this.baseService.findByIdAsync(id);
        if (!entity)
            throw new common_1.NotFoundException(`Entity with id ${id} does not exist`);
        return entity;
    }
    async create(dto) {
        const newEntity = this.baseService.createEntity(dto);
        await this.baseService.insertAsync(newEntity);
        return newEntity.id;
    }
    async delete(id) {
        this.baseService.deleteByIdAsync(id);
    }
    async update(id, dto) {
        const entity = await this.baseService.updateAsync(id, dto);
        return entity;
    }
}
__decorate([
    common_1.Get(),
    swagger_1.ApiOkResponse({ description: 'Ok' }),
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
    swagger_1.ApiCreatedResponse({
        description: 'Entity successfully created.',
    }),
    swagger_1.ApiResponse({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    swagger_1.ApiBadRequestResponse({ description: 'Bad Request.' }),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "create", null);
__decorate([
    common_1.Delete(':id'),
    swagger_1.ApiOkResponse({ description: 'Entity deleted successfully.' }),
    swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException, description: 'Bad Request.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "delete", null);
__decorate([
    common_1.Put(':id'),
    swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException, description: 'Bad Request.' }),
    swagger_1.ApiOkResponse({ description: 'Entity deleted successfully.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "update", null);
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map