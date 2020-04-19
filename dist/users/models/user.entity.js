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
const common_1 = require("@nestjs/common");
const typegoose_1 = require("@typegoose/typegoose");
const bcrypt_1 = require("bcrypt");
const constants_1 = require("../../shared/constants");
const base_entity_1 = require("../../shared/models/base.entity");
const class_transformer_1 = require("class-transformer");
let User = class User extends base_entity_1.BaseEntity {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
};
__decorate([
    typegoose_1.prop({
        required: true,
        maxlength: constants_1.columnSize.length64,
        trim: true,
        text: true,
        unique: false,
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typegoose_1.prop({
        required: true,
        maxlength: constants_1.columnSize.length64,
        trim: true,
        text: true,
        unique: false,
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typegoose_1.prop({
        required: true,
        maxlength: constants_1.columnSize.length64,
        trim: true,
        lowercase: true,
        text: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ required: true, maxlength: constants_1.columnSize.length64 }),
    class_transformer_1.Exclude(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = __decorate([
    typegoose_1.pre('save', async function () {
        try {
            this.password = await bcrypt_1.hash(this.password, 10);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    })
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map