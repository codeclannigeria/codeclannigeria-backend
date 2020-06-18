import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared';
import configuration from './shared/config/configuration';
import { envValidation } from './shared/validations/env.validation';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';

export const config = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: envValidation(),
  expandVariables: true,
  validationOptions: {
    abortEarly: true
  }
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
      useFindAndModify: false
    }),
    MailModule,
    ProfileModule,
    TracksModule,
    CategoriesModule
  ],

  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
