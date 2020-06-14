interface Database {
  host: string;
  port: number;
  name: string;
  uri: string;
}
interface Mailer {
  key: string;
  domain: string;
}
interface Configuration {
  port: number;
  jwtSecret: string;
  environment: string;
  database: Database;
  rootUrl: string;
  redisUrl: string;
  isAuthEnabled: boolean;
  appEmail: string;
  mailer: Mailer;
}

export default (): Configuration => ({
  port: parseInt(process.env.PORT, 10),
  environment: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  rootUrl: process.env.ROOT_URL,
  redisUrl: process.env.REDIS_SERVER_URL,
  isAuthEnabled: process.env.API_AUTH_ENABLED === 'true',
  appEmail: process.env.APP_EMAIL,
  mailer: {
    key: process.env.MAILER_API_KEY,
    domain: process.env.MAILER_DOMAIN,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    name: process.env.DATABASE_NAME,
    uri: process.env.MONGODB_URI,
  },
});
