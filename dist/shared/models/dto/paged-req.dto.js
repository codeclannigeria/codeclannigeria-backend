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
const class_validator_1 = require("class-validator");
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
//# sourceMappingURL=paged-req.dto.js.map