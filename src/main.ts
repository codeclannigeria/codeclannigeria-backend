import * as compression from 'compression';
import * as connectMongo from 'connect-mongo';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as passport from 'passport';
import configuration from '~shared/config/configuration';
import { AllExceptionsFilter } from '~shared/filters/all-exception.filter';
import { HttpExceptionFilter } from '~shared/filters/http-exception.filter';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';

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

  Sentry.init({
    dsn:
      'https://3dcfb48db352455a842415fe3f8af230@o854355.ingest.sentry.io/5819318',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });

  // filters
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  // validation
  const { jwtSecret, port, database } = configuration();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      // disableErrorMessages: environment === 'production',
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  const MongoStore = connectMongo(session);
  app.set('trust proxy', 1);
  app.setGlobalPrefix('/api');
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
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none'
    }
  });

  const listener = await app.listen(process.env.PORT || port, function () {
    Logger.log('Listening on port ' + listener.address().port);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
