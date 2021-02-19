import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-express';
import { ContextWithUser } from '../../types/Apollo.types';
import { getUserById } from '../../utils/dbQueries.util';
import { User } from '../../entities/User.entity';

export const Auth: MiddlewareFn<ContextWithUser> = async ({ context }, next) => {
  const userID = context.session.userID;
  if (!userID) throw new AuthenticationError('Login required');
  const user = await getUserById(userID);
  if (user) context.user = user;

  return next();
};

export const AuthWithCart: MiddlewareFn<ContextWithUser> = async ({ context }, next) => {
  const userID = context.session.userID;
  if (!userID) throw new AuthenticationError('Login required');
  const user = await getUserById(userID, ['cart', 'cart.product']);
  if (user) context.user = user;

  return next();
};

export const AuthWithWishlist: MiddlewareFn<ContextWithUser> = async ({ context }, next) => {
  const userID = context.session.userID;
  if (!userID) throw new AuthenticationError('Login required');
  const user = await getUserById(userID, ['wishlist']);
  if (user) context.user = user;

  return next();
};

export const AuthWithOrders: MiddlewareFn<ContextWithUser> = async ({ context }, next) => {
  const userID = context.session.userID;
  if (!userID) throw new AuthenticationError('Login required');
  const user = await User.findOne(
    { id: userID },
    {
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          orders: 'user.orders',
          items: 'orders.items',
          product: 'items.product',
        },
      },
    }
  );
  if (user) context.user = user;

  return next();
};
