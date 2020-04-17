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
const typegoose_1 = require("@typegoose/typegoose");
class BaseEntity {
    static get schema() {
        return typegoose_1.buildSchema(this, {
            timestamps: true,
            toJSON: {
                getters: true,
                virtuals: true,
            },
        });
    }
    static get modelName() {
        return this.name;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { createdDate: { required: false, type: () => Date }, updatedDate: { required: false, type: () => Date }, id: { required: true, type: () => String }, isDeleted: { required: true, type: () => Boolean }, deletionDate: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, deletedBy: { required: true, type: () => String } };
    }
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], BaseEntity.prototype, "createdDate", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], BaseEntity.prototype, "updatedDate", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Boolean)
], BaseEntity.prototype, "isDeleted", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], BaseEntity.prototype, "deletionDate", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], BaseEntity.prototype, "createdBy", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], BaseEntity.prototype, "deletedBy", void 0);
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=base.entity.js.map