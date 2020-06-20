import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { MailModule } from './shared/mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared';
import configuration from './shared/config/configuration';
import { envValidation } from './shared/validations/env.validation';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

export const Config = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: envValidation(),
  expandVariables: true,
  validationOptions: {
    abortEarly: true
  }
});
const Database = MongooseModule.forRoot(configuration().database.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
@Module({
  imports: [
    SharedModule,
    AuthModule,
    UsersModule,
    Config,
    Database,
    MailModule,
    ProfileModule,
    TracksModule,
    CoursesModule,
    CategoriesModule
  ],

  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
