import 'reflect-metadata';
import dotenv from 'dotenv';
import { Server } from 'http';
import { apolloLoader } from './startup/apollo.loader';
import { expressLoader } from './startup/express.loader';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { dbLoader } from './startup/db.loader';

dotenv.config();

const log = logger.extend('index');

export let server: Server | undefined;

(async function () {
  try {
    await dbLoader();
    const apolloServer = await apolloLoader();
    const app = await expressLoader();

    if (app && apolloServer)
      apolloServer.applyMiddleware({
        app,
        cors: {
          // origin: config.FRONTEND_URL,
          credentials: true,
        },
      });

    server = app?.listen(config.PORT, () => log(`App started at ${config.BACKEND_URL}`));
  } catch (e) {
    log(e);
  }
})();
