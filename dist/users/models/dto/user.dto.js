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
const constants_1 = require("../../../shared/constants");
const user_entity_1 = require("../user.entity");
class UserDto {
    constructor() {
        this.role = user_entity_1.UserRole.User;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String, maxLength: constants_1.columnSize.length64 }, lastName: { required: true, type: () => String, maxLength: constants_1.columnSize.length64 }, email: { required: true, type: () => String, maxLength: constants_1.columnSize.length64 }, role: { required: true, default: user_entity_1.UserRole.User, enum: require("../user.entity").UserRole } };
    }
}
__decorate([
    class_transformer_1.Expose(),
    class_validator_1.IsMongoId(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "id", void 0);
__decorate([
    class_transformer_1.Expose(),
    class_validator_1.MaxLength(constants_1.columnSize.length64),
    swagger_1.ApiProperty(),
    class_validator_1.IsAlpha(),
    __metadata("design:type", String)
], UserDto.prototype, "firstName", void 0);
__decorate([
    class_transformer_1.Expose(),
    class_validator_1.MaxLength(constants_1.columnSize.length64),
    swagger_1.ApiProperty(),
    class_validator_1.IsAlpha(),
    __metadata("design:type", String)
], UserDto.prototype, "lastName", void 0);
__decorate([
    class_transformer_1.Expose(),
    swagger_1.ApiProperty(),
    class_validator_1.IsEmail(),
    class_validator_1.MaxLength(constants_1.columnSize.length64),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({ enum: user_entity_1.UserRole }),
    class_validator_1.IsEnum(user_entity_1.UserRole),
    class_transformer_1.Expose(),
    __metadata("design:type", String)
], UserDto.prototype, "role", void 0);
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map