import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

const dbFactory = MongooseModule.forRootAsync({
  useFactory: async () => {
    process.env.MAILER_API_KEY = 'api_key_mailgun';
    process.env.MAILER_DOMAIN = 'mailer_domain_mailgun';
    const uri = await mongod.getUri();

    return {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      uri
    };
  }
});

@Module({
  imports: [dbFactory],
  exports: [dbFactory]
})
export class DbTest {}
