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
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const abstract_core_service_1 = require("../abstract-core.service");
const constants_copy_1 = require("../constants copy");
const decorators_1 = require("../decorators");
const utils_1 = require("../utils");
function abstractControllerWithSwagger(options) {
    const { model, modelVm, modelCreate } = options;
    const auth = utils_1.getAuthObj(options.auth);
    let AbstractController = class AbstractController {
        constructor(service) {
            this._service = service;
        }
        async find(filter) {
            const findFilter = filter ? JSON.parse(filter) : {};
            try {
                return this._service.find(findFilter);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async findById(id) {
            try {
                return this._service.findById(id);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async create(doc) {
            try {
                const newObject = new model(doc);
                return this._service.create(newObject);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async update(id, doc) {
            try {
                const existed = await this._service.findById(id);
                const updatedDoc = Object.assign(Object.assign({}, existed), doc);
                return this._service.update(id, updatedDoc);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async delete(id) {
            try {
                return this._service.delete(id);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
    };
    __decorate([
        common_1.Get(),
        decorators_1.Authenticate(!!auth && auth.find, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.find, swagger_1.ApiBearerAuth()),
        swagger_1.ApiQuery({
            name: 'filter',
            description: 'Find Query',
            required: false,
            isArray: false,
        }),
        swagger_1.ApiOkResponse({ type: modelVm, isArray: true }),
        decorators_1.ApiSwaggerOperation({ title: 'FindAll' }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Query('filter')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "find", null);
    __decorate([
        common_1.Get(':id'),
        decorators_1.Authenticate(!!auth && auth.findById, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.findById, swagger_1.ApiBearerAuth()),
        swagger_1.ApiParam({
            name: 'id',
            required: true,
            description: 'Id of Object',
            type: String,
        }),
        swagger_1.ApiOkResponse({ type: modelVm }),
        decorators_1.ApiSwaggerOperation({ title: 'FindById' }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "findById", null);
    __decorate([
        common_1.Post(),
        decorators_1.Authenticate(!!auth && auth.create, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.create, swagger_1.ApiBearerAuth()),
        swagger_1.ApiBody({
            type: modelCreate,
            description: 'Data for model creation',
            required: true,
            isArray: false,
        }),
        swagger_1.ApiOkResponse({ type: modelVm }),
        decorators_1.ApiSwaggerOperation({ title: 'Create' }),
        openapi.ApiResponse({ status: 201 }),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "create", null);
    __decorate([
        common_1.Put(':id'),
        decorators_1.Authenticate(!!auth && auth.update, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.update, swagger_1.ApiBearerAuth()),
        swagger_1.ApiBody({
            type: modelVm,
            description: 'Data for object update',
            required: true,
            isArray: false,
        }),
        swagger_1.ApiParam({
            name: 'id',
            required: true,
            description: 'Id of Object',
            type: String,
        }),
        swagger_1.ApiOkResponse({ type: modelVm }),
        decorators_1.ApiSwaggerOperation({ title: 'Update' }),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "update", null);
    __decorate([
        common_1.Delete(':id'),
        decorators_1.Authenticate(!!auth && auth.delete, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.delete, swagger_1.ApiBearerAuth()),
        swagger_1.ApiParam({
            name: 'id',
            required: true,
            description: 'Id of Object',
            type: String,
        }),
        swagger_1.ApiOkResponse({ type: modelVm }),
        decorators_1.ApiSwaggerOperation({ title: 'Delete' }),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "delete", null);
    AbstractController = __decorate([
        swagger_1.ApiTags(model.name),
        __metadata("design:paramtypes", [abstract_core_service_1.AbstractCoreService])
    ], AbstractController);
    return AbstractController;
}
exports.abstractControllerWithSwagger = abstractControllerWithSwagger;
//# sourceMappingURL=abstract-with-swagger.controller.js.map