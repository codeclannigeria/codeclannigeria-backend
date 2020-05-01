import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SharedModule } from './shared';
import configuration from './shared/config/configuration';
import { envValidation } from './shared/validations/env.validation';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';

const config = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: envValidation(),
  expandVariables: true,
  validationOptions: {
    // allowUnknown: false,
    abortEarly: true,
  },
});
@Module({
  imports: [
    SharedModule.forRoot(),
    AuthModule,
    UsersModule,
    config,
    MongooseModule.forRoot(configuration().database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    MailModule,
    ProfileModule,
  ],

  controllers: [AuthController],
})
export class AppModule {}
