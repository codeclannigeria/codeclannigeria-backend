import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.MAILER_API_KEY = 'api_key_mailgun';
process.env.MONGOMS_SYSTEM_BINARY = '/usr/local/bin/mongod';
process.env.MAILER_DOMAIN = 'mailer_domain_mailgun';
const dbServer = new MongoMemoryServer();
export const inMemoryDb = dbServer;

const dbFactory = MongooseModule.forRootAsync({
  useFactory: async () => {
    const uri = await dbServer.getUri();
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
