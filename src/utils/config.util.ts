import { logger } from './logger.util';

const log = logger.extend('config');

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,

  DATABASE_URL: process.env.DATABASE_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,

  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_KEY: process.env.JWT_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

try {
  let prop: keyof typeof config;
  for (prop in config) {
    if (!config[prop]) throw new Error(`${prop} not set`);
  }
} catch (e) {
  log('Config incomplete. Set the missing properties in environment variables.');
  throw e;
}
