import { logger } from 'src/utils/logger';

const log = logger.extend('config');

export const config = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 3001,

	DB_URL: process.env.DB_URL,
	FRONTEND_URL: process.env.FRONTEND_URL,
	BACKEND_URL: process.env.BACKEND_URL,

	SESSION_SECRET: process.env.SESSION_SECRET,
};

try {
	if (!config.DB_URL) throw new Error('DB_URL not set');
	if (!config.FRONTEND_URL) throw new Error('FRONTEND_URL not set');
	if (!config.BACKEND_URL) throw new Error('BACKEND_URL not set');
	if (!config.SESSION_SECRET) throw new Error('SESSION_SECRET not set');
} catch (e) {
	log('Config incomplete');
	throw e;
}
