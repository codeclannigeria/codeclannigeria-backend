"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
exports.envValidation = () => Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),
    ROOT_URL: Joi.string()
        .uri()
        .required(),
    DATABASE_PORT: Joi.number().default(27017),
    DATABASE_HOST: Joi.string().default('localhost'),
    DATABASE_NAME: Joi.string().required(),
    MONGODB_URI: Joi.string().required(),
    API_AUTH_ENABLED: Joi.string()
        .valid('true', 'false')
        .default('true'),
    APP_EMAIL: Joi.string()
        .email()
        .required(),
});
//# sourceMappingURL=env.validation.js.map