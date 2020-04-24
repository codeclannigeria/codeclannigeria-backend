import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AbstractModule } from './shared';

@Module({
  imports: [
    AbstractModule.forRoot(),
    AuthModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost/nest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
  ],
  controllers: [AuthController],
})
export class AppModule {}
