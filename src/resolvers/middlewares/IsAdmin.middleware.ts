import { MiddlewareFn } from 'type-graphql';
import { ForbiddenError } from 'apollo-server-express';
import { ContextWithUser } from '../../types/Apollo.types';

export const IsAdmin: MiddlewareFn<ContextWithUser> = ({ context: { user } }, next) => {
  if (!/admin/i.test(user.role)) throw new ForbiddenError('Unauthorized access');
  return next();
};
