"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
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
exports.ApiException = ApiException;
//# sourceMappingURL=api-exception.model.js.map