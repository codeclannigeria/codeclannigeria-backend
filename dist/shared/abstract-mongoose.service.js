"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const abstract_core_service_1 = require("./abstract-core.service");
class AbstractMongooseService extends abstract_core_service_1.AbstractCoreService {
    constructor(model) {
        super();
        this._model = model;
        AbstractMongooseService.model = model;
    }
    async find(filter = {}) {
        return this._model.find(filter).exec();
    }
    async findById(id) {
        return this._model.findById(this.toObjectId(id)).exec();
    }
    async findOne(filter = {}) {
        return this._model.findOne(filter).exec();
    }
    async create(doc) {
        return this._model.create(doc);
    }
    async update(id, updatedDoc) {
        return (await this._model
            .findByIdAndUpdate(this.toObjectId(id), updatedDoc)
            .exec());
    }
    async delete(id) {
        return (await this._model
            .findByIdAndDelete(this.toObjectId(id))
            .exec());
    }
    toObjectId(id) {
        return mongoose_1.Types.ObjectId(id);
    }
}
exports.AbstractMongooseService = AbstractMongooseService;
//# sourceMappingURL=abstract-mongoose.service.js.map