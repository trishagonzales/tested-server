import { MiddlewareFn, UnauthorizedError } from 'type-graphql';
import { ContextWithUser } from '../../types/ApolloTypes';
import { User } from '../../entities/User.entity';
import { logger } from '../../utils/logger';
import { AuthenticationError } from 'apollo-server-express';

const log = logger.extend('auth-middleware');

export const Auth: MiddlewareFn<ContextWithUser> = async ({ context }, next) => {
  const user = await User.findOne(
    { id: context.session.userId },
    { relations: ['wishlists', 'cart'] }
  );
  if (!user) throw new AuthenticationError('Login required');

  context.user = user;

  return next();
};
