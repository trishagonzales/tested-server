import express from 'express';
import connectRedis from 'connect-redis';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import { redis } from 'src/utils/redis';
import { logger } from 'src/utils/logger';

const log = logger.extend('express-loader');

export async function expressLoader() {
	try {
		const RedisStore = connectRedis(session);

		const app = express();
		app.use(helmet());
		app.use(morgan('tiny'));

		app.use(
			session({
				store: new RedisStore({ client: redis }),
				name: 'cid',
				secret: process.env.SESSION_SECRET as string,
				resave: false,
				saveUninitialized: false,
				cookie: {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					maxAge: 1000 * 60 * 60 * 24 * 100, // 100 days
				},
			})
		);

		return app;
	} catch (e) {
		log('Failed to configure express');
		throw e;
	}
}
