"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("@nestjs/swagger");
exports.ApiSwaggerOperation = (options) => {
    return (target, propertyKey, descriptor) => {
        const controllerName = target.constructor.name;
        swagger_1.ApiOperation(Object.assign(Object.assign({}, options), { operationId: `${controllerName.substr(0, controllerName.indexOf('Controller'))}_${propertyKey}` }))(target, propertyKey, descriptor);
    };
};
//# sourceMappingURL=api-swagger-operation.decorator.js.map