"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const helmet = require("helmet");
const passport = require("passport");
const app_module_1 = require("./app.module");
const constants_1 = require("./auth/constants");
const configuration_1 = require("./shared/config/configuration");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use(helmet());
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));
    app.use(compression());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.use(session({
        secret: constants_1.jwtConstants.secret,
        resave: false,
        saveUninitialized: false,
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    const options = new swagger_1.DocumentBuilder()
        .setTitle('ToRead API')
        .setDescription('ToRead API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(configuration_1.default().port);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map