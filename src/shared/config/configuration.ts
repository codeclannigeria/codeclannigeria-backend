interface Database {
  host: string;
  port: number;
  name: string;
  uri: string;
}

interface Configuration {
  port: number;
  jwtSecret: string;
  database: Database;
  rootUrl: string;
  isAuthEnabled: boolean;
  appEmail: string;
}

export default (): Configuration => ({
  port: parseInt(process.env.PORT, 10),
  jwtSecret: process.env.JWT_SECRET,
  rootUrl: process.env.ROOT_URL,
  isAuthEnabled: process.env.API_AUTH_ENABLED === 'true',
  appEmail: process.env.APP_EMAIL,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    name: process.env.DATABASE_NAME,
    uri: process.env.MONGODB_URI,
  },
});
