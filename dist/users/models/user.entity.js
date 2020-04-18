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
const constants_1 = require("../../shared/constants");
const base_entity_1 = require("../../shared/models/base.entity");
const typegoose_1 = require("@typegoose/typegoose");
let User = class User extends base_entity_1.BaseEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
};
__decorate([
    typegoose_1.prop({ required: true, maxlength: constants_1.columnSize.length64 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typegoose_1.prop({ required: true, maxlength: constants_1.columnSize.length64 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typegoose_1.prop({ unique: true, index: true, maxlength: constants_1.columnSize.length64 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ required: true, maxlength: constants_1.columnSize.length64 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = __decorate([
    typegoose_1.pre('save', function () {
        this.password = 'Yeller';
    })
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map