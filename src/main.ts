import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as passport from 'passport';

import { AppModule } from './app.module';
import configuration from './shared/config/configuration';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import * as connectMongo from 'connect-mongo';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.connectMicroservice({
  //   transport: Transport.REDIS,
  //   options: {
  //     url: 'redis://localhost:6379',
  //   },
  // });
  // security
  app.enableCors();
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // compression
  app.use(compression());

  // filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const MongoStore = connectMongo(session);
  const { jwtSecret, port, database } = configuration();
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: jwtSecret,
      store: new MongoStore({ url: database.uri }),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  const options = new DocumentBuilder()
    .setTitle('CodeClanNigeria API')
    .setDescription('CCNigeria API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservicesAsync();
  const listener = await app.listen(process.env.PORT || port, function () {
    Logger.log('Listening on port ' + listener.address().port);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
