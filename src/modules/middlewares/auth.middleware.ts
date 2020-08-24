import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../../types/apollo.types';

export const Auth: MiddlewareFn<MyContext> = async ({ context }, next) => {
	if (!context.session) throw new Error('Login required');

	return next();
};
