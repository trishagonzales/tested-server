import 'reflect-metadata';
import dotenv from 'dotenv';
import { Server } from 'http';
import { apolloLoader } from './startup/apollo.loader';
import { expressLoader } from './startup/express.loader';
import { config } from './utils/config';
import { logger } from '@utils/logger';

dotenv.config();

const log = logger.extend('index');

export let server: Server | undefined;

(async function () {
	try {
		const apolloServer = await apolloLoader();
		const app = await expressLoader();

		if (app && apolloLoader) apolloServer?.applyMiddleware({ app, cors: true });

		server = app?.listen(config.PORT, () => log(`App started on port ${config.PORT} ...`));
	} catch (e) {
		log('Something failed ...');
		log(e);
	}
})();
