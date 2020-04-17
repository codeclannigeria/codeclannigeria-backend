"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const api_exception_model_1 = require("../models/api-exception.model");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(error, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const statusCode = error.getStatus();
        const stacktrace = error.stack;
        const errorName = error.response.name || error.response.error || error.name;
        const errors = error.response.errors || null;
        const path = req ? req.url : null;
        if (statusCode === common_1.HttpStatus.UNAUTHORIZED) {
            if (typeof error.response !== 'string') {
                error.response.message =
                    error.response.message ||
                        'You do not have permission to access this resource';
            }
        }
        const exception = new api_exception_model_1.ApiException(error.response.message, errorName, stacktrace, errors, path, statusCode);
        res.status(statusCode).json(exception);
    }
};
HttpExceptionFilter = __decorate([
    common_1.Catch(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=http-exception.filter.js.map