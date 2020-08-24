import { createConnection } from 'typeorm';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

const log = logger.extend('db-loader');

export async function dbLoader() {
	try {
		await createConnection({
			type: 'mysql',
			url: config.DB_URL,
			synchronize: true,

			entities: ['@entities/**/*.entity.ts'],
		});
	} catch (e) {
		log('Failed to connect to database');
		throw e;
	}
}
