"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10),
    jwtSecret: process.env.JWT_SECRET,
    rootUrl: process.env.ROOT_URL,
    isAuthEnabled: process.env.API_AUTH_ENABLED === 'true',
    appEmail: process.env.APP_EMAIL,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        name: process.env.DATABASE_NAME,
        uri: process.env.MONGODB_URI,
    },
});
//# sourceMappingURL=configuration.js.map