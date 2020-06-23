import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as connectMongo from 'connect-mongo';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as passport from 'passport';

import { AppModule } from './app.module';
import configuration from './shared/config/configuration';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    })
  );

  // compressions
  app.use(compression());

  // filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // validation
  const { jwtSecret, port, database, environment } = configuration();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      disableErrorMessages: environment === 'production',
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  const MongoStore = connectMongo(session);
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: jwtSecret,
      store: new MongoStore({ url: database.uri }),
      resave: false,
      saveUninitialized: false
    })
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

  const listener = await app.listen(process.env.PORT || port, function () {
    Logger.log('Listening on port ' + listener.address().port);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
