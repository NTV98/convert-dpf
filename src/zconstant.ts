import { config } from 'dotenv';

config();

export const projectName = 'notification-server';

export const serviceport = Number.parseInt(process.env.PORT);

export const mongoUri = process.env.MONGO_URI;

export const mongoUriUser = process.env.MONGO_URI_USER;

export const redisconfig = {
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT),
  password: '',
};

export const vaultConfig = {
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ENDPOINT,
  token: process.env.VAULT_TOKEN,
};

export const jwt = {
  secret: '',
};
export const Internal = {
  secret: '',
};

export const jwt_retail = {
  secret: '',
};
export const kafka = {
  broker: process.env.KAFKA_BROKER,
  username: '',
  password: '',
  topics: {
    formatdocxTopdf: 'formatfile.to.pdf',
    formatHTMLTopdf: 'formathtml.to.pdf',
    activitylog: 'asynclogger.activitylog',
    generallog: 'asynclogger.generallog',
    handledocxTopdf: "formatfile.handle.pdf"
  },
};

export const minioConfig = {
  minioSSL: process.env.MINIO_SSL === 'true',
  minioServer: process.env.MINIO_SERVER,
  minioAccessKey: process.env.MINIO_ACCESS_KEY,
  minioSecretKey: process.env.MINIO_SECRET_KEY,
};

export const codeMyDP247 = 'MYDP247';


export const BUCKET = process.env.BUCKET;