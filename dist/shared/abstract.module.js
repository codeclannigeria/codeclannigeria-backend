"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AbstractModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const abstract_core_service_1 = require("./abstract-core.service");
const abstract_mongoose_service_1 = require("./abstract-mongoose.service");
let AbstractModule = AbstractModule_1 = class AbstractModule {
    static forRoot() {
        return {
            module: AbstractModule_1,
            providers: [
                { provide: abstract_core_service_1.AbstractCoreService, useClass: abstract_mongoose_service_1.AbstractMongooseService },
            ],
        };
    }
};
AbstractModule = AbstractModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], AbstractModule);
exports.AbstractModule = AbstractModule;
//# sourceMappingURL=abstract.module.js.map