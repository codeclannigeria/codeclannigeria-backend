import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CoursesModule } from './courses/courses.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared';
import configuration from './shared/config/configuration';
import { MailModule } from './shared/mail/mail.module';
import { envValidation } from './shared/validations/env.validation';
import { StagesModule } from './stages/stages.module';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { MentorModule } from './mentor/mentor.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { MentorMenteeModule } from './mentor-mentee/mentor-mentee.module';

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
    CategoriesModule,
    StagesModule,
    TasksModule,
    MentorModule,
    SubmissionsModule,
    MentorMenteeModule
  ],

  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
