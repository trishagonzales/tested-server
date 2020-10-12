import { createConnection } from 'typeorm';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

const log = logger.extend('db-loader');

export async function dbLoader() {
  try {
    await createConnection({
      type: 'mysql',
      url: config.DATABASE_URL,
      synchronize: true,

      entities: [process.cwd() + '/src/entities/**/*.entity.ts'],
    });
  } catch (e) {
    log('Failed to connect to database');
    log(e);
  }
}
