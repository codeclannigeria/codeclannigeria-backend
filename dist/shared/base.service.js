"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
class BaseService {
    constructor(entity) {
        this.entity = entity;
    }
    static throwMongoError(err) {
        throw new common_1.InternalServerErrorException(err, err.errmsg);
    }
    static toObjectId(id) {
        try {
            return mongoose_1.Types.ObjectId(id);
        }
        catch (e) {
            this.throwMongoError(e);
        }
    }
    createEntity(doc) {
        return new this.entity(doc);
    }
    insert(entity) {
        return this.entity.create(entity);
    }
    async insertAsync(entity) {
        try {
            return await this.insert(entity);
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    findAll(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.find(filter);
    }
    async findAllAsync(filter = {}) {
        try {
            return await this.findAll(filter).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    findOne(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.findOne(filter);
    }
    async findOneAsync(filter = {}) {
        try {
            return await this.findOne(filter).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    findById(id) {
        return this.entity
            .findById(BaseService.toObjectId(id))
            .where('isDeleted')
            .ne(true);
    }
    async findByIdAsync(id) {
        try {
            return await this.findById(id).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    async create(item) {
        try {
            return await this.entity.create(item);
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    delete(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.findOneAndDelete(filter);
    }
    softDelete(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.findOneAndUpdate(filter, { isDeleted: true });
    }
    async deleteAsync(filter = {}) {
        try {
            return await this.softDelete(filter).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    deleteById(id) {
        return this.entity
            .findByIdAndDelete(BaseService.toObjectId(id))
            .where('isDeleted')
            .ne(true);
    }
    softDeleteById(id) {
        return this.entity
            .findByIdAndUpdate(BaseService.toObjectId(id), { isDeleted: true })
            .where('isDeleted')
            .ne(true);
    }
    async deleteByIdAsync(id) {
        try {
            return await this.softDeleteById(id).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    update(item) {
        return this.entity
            .findByIdAndUpdate(BaseService.toObjectId(item.id), item, {
            new: true,
        })
            .where('isDeleted')
            .ne(true);
    }
    async updateAsync(item) {
        try {
            return await this.update(item).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    count(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.countDocuments(filter);
    }
    async countAsync(filter = {}) {
        try {
            return await this.count(filter);
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map