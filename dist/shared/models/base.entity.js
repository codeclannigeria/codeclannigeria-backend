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
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
class BaseEntity extends defaultClasses_1.TimeStamps {
    constructor() {
        super(...arguments);
        this.isDeleted = false;
        this.createdBy = null;
        this.updatedBy = null;
        this.isActive = true;
        this.deletedBy = null;
        this.createdAt = new Date();
        this.updatedAt = null;
    }
    static get schema() {
        return typegoose_1.buildSchema(this, {
            timestamps: true,
            toJSON: {
                getters: true,
                virtuals: true,
                versionKey: false,
                transform: (_, ret) => {
                    ret.id = ret._id;
                    delete ret._id;
                },
            },
        });
    }
    static get modelName() {
        return this.name;
    }
    delete() {
        this.isDeleted = true;
    }
    restore() {
        this.isDeleted = false;
    }
    deactivate() {
        this.isActive = false;
    }
    activate() {
        this.isActive = true;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, isDeleted: { required: true, type: () => Boolean, default: false }, createdBy: { required: false, type: () => Object, default: null }, updatedBy: { required: false, type: () => Object, default: null }, isActive: { required: true, type: () => Boolean, default: true }, deletedBy: { required: false, type: () => Object, default: null }, deletedAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date, default: new Date() }, updatedAt: { required: true, type: () => Date, default: null } };
    }
}
__decorate([
    typegoose_1.prop({ required: true, default: false }),
    __metadata("design:type", Boolean)
], BaseEntity.prototype, "isDeleted", void 0);
__decorate([
    typegoose_1.prop({ default: null, ref: BaseEntity }),
    __metadata("design:type", Object)
], BaseEntity.prototype, "createdBy", void 0);
__decorate([
    typegoose_1.prop({ default: null, ref: BaseEntity }),
    __metadata("design:type", Object)
], BaseEntity.prototype, "updatedBy", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: true }),
    __metadata("design:type", Boolean)
], BaseEntity.prototype, "isActive", void 0);
__decorate([
    typegoose_1.prop({ default: null, ref: BaseEntity }),
    __metadata("design:type", Object)
], BaseEntity.prototype, "deletedBy", void 0);
__decorate([
    typegoose_1.prop({ default: null }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "deletedAt", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date() }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "createdAt", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date() }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "updatedAt", void 0);
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=base.entity.js.map