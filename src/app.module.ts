import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AbstractModule } from './shared';
import configuration from './shared/config/configuration';
import { envValidation } from './shared/validations/env.validation';
import { UsersModule } from './users/users.module';

// const MongooseConfig = MongooseModule.forRootAsync({
//   imports: [ConfigModule],
//   useFactory: async (config: ConfigService) => {
//     return {
//       uri: config.get<string>(envConsts.mongoDbUri),
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     };
//   },
//   inject: [ConfigService],
// });

@Module({
  imports: [
    AbstractModule.forRoot(),
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation(),
      expandVariables: true,
      validationOptions: {
        // allowUnknown: false,
        abortEarly: true,
      },
    }),
    MongooseModule.forRoot(configuration().database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
  ],
  controllers: [AuthController],
})
export class AppModule {}
