import { MiddlewareFn } from 'type-graphql';
import { ContextWithUser } from '../../types/ApolloTypes';
import { logger } from '../../utils/logger';
import { ForbiddenError } from 'apollo-server-express';

const log = logger.extend('isauthorized-middleware');

export const IsAdmin: MiddlewareFn<ContextWithUser> = ({ context: { user } }, next) => {
  if (!/admin/i.test(user.role)) throw new ForbiddenError('Unauthorized access');
  return next();
};
