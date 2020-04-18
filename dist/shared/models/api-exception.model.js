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
const swagger_1 = require("@nestjs/swagger");
class ApiException {
    constructor(message, error, stack, errors, path, statusCode) {
        this.message = message;
        this.error = error;
        this.stack = stack;
        this.errors = errors;
        this.path = path;
        this.timestamp = new Date().toISOString();
        this.statusCode = statusCode;
        this.status = common_1.HttpStatus[statusCode];
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], ApiException.prototype, "statusCode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "message", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "error", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], ApiException.prototype, "errors", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "timestamp", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "path", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "stack", void 0);
exports.ApiException = ApiException;
//# sourceMappingURL=api-exception.model.js.map