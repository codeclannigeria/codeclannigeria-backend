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
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PagedResDto {
    constructor(totalCount, items, type) {
        this.items = items;
        this.type = type;
        this.totalCount = totalCount;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, type: () => Object }, totalCount: { required: true, type: () => Number }, items: { required: true } };
    }
}
__decorate([
    class_transformer_1.Exclude(),
    __metadata("design:type", Function)
], PagedResDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PagedResDto.prototype, "totalCount", void 0);
__decorate([
    swagger_1.ApiProperty({
        isArray: true,
        type: this.type,
    }),
    class_transformer_1.Type(options => {
        return options.newObject.type;
    }),
    __metadata("design:type", Array)
], PagedResDto.prototype, "items", void 0);
exports.PagedResDto = PagedResDto;
class PagedReqDto {
    constructor() {
        this.skip = 0;
        this.limit = 100;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { skip: { required: false, type: () => Number, default: 0 }, limit: { required: false, type: () => Number, default: 100 }, search: { required: false, type: () => String } };
    }
}
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], PagedReqDto.prototype, "skip", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], PagedReqDto.prototype, "limit", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PagedReqDto.prototype, "search", void 0);
exports.PagedReqDto = PagedReqDto;
function PaginatedResponseDto(entityDto) {
    class Paged extends entityDto {
        static _OPENAPI_METADATA_FACTORY() {
            return { totalCount: { required: true, type: () => Number }, items: { required: true } };
        }
    }
    __decorate([
        swagger_1.ApiProperty(),
        __metadata("design:type", Number)
    ], Paged.prototype, "totalCount", void 0);
    __decorate([
        swagger_1.ApiProperty({
            type: entityDto,
            isArray: true,
        }),
        __metadata("design:type", Array)
    ], Paged.prototype, "items", void 0);
    return Paged;
}
exports.PaginatedResponseDto = PaginatedResponseDto;
//# sourceMappingURL=paged.dto.js.map