import { createConnection } from 'typeorm';
import { config } from '../utils/config.util';
import { logger } from '../utils/logger.util';

const log = logger.extend('db-loader');

export async function dbLoader() {
  try {
    await createConnection({
      type: 'mysql',
      url: config.DATABASE_URL,
      synchronize: config.NODE_ENV !== 'production' && true,

      entities: [process.cwd() + '/src/entities/**/*.entity.ts'],
    });
  } catch (e) {
    log('Failed to connect to database');
    log(e);
  }
}
