import Joi from '@hapi/joi';

export const envValidation = (): any => {
  return Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),
    JWT_VALIDITY_HOURS: Joi.number().required(),
    ROOT_URL: Joi.string().uri().required(),
    REDIS_SERVER_URL: Joi.string().uri().default('redis://localhost:6379'),
    DATABASE_PORT: Joi.number().default(27017),
    DATABASE_HOST: Joi.string().default('localhost'),
    DATABASE_NAME: Joi.string().required(),
    MONGODB_URI: Joi.string().required(),
    MAILER_API_KEY: Joi.string().required(),
    MAILER_DOMAIN: Joi.string().required(),
    API_AUTH_ENABLED: Joi.string().valid('true', 'false').default('true'),
    APP_EMAIL: Joi.string().email().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),
    CLOUDINARY_NAME: Joi.string().required()
  });
};
