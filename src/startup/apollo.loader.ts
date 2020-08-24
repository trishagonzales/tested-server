import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { logger } from '../utils/logger';

const log = logger.extend('apollo-loader');

export async function apolloLoader() {
	try {
		const schema = await buildSchema({
			resolvers: [process.cwd() + '/**/*.resolver.{ts,js}'],
		});

		const apolloServer = new ApolloServer({ schema, context: ({ req, res }) => ({ req, res, session: req.session }) });

		return apolloServer;
	} catch (e) {
		log('Failed to build Apollo Server');
		throw e;
	}
}
