import express from 'express';
import connectRedis from 'connect-redis';
import session from 'express-session';
import helmet from 'helmet';
import { redis } from '../utils/redis';
import { logger } from '../utils/logger';
import { config } from '../utils/config';

const log = logger.extend('express-loader');

export async function expressLoader() {
  try {
    const RedisStore = connectRedis(session);

    const app = express();

    app.set('trust proxy', 1);
    app.use(helmet());

    app.use(
      session({
        store: new RedisStore({ client: redis }),
        name: 'cid',
        secret: config.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 100, // 100 days
        },
      })
    );

    return app;
  } catch (e) {
    log('Failed to configure express');
    log(e);
  }
}
