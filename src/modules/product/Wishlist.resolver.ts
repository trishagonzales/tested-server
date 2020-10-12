import { Resolver, Mutation, Arg, Ctx, Authorized, Query, UseMiddleware } from 'type-graphql';
import { UserInputError } from 'apollo-server-express';
import _ from 'lodash';

import { Product } from '../../entities/Product.entity';
import { ContextWithUser } from '../../types/ApolloTypes';
import { Auth } from '../middlewares/Auth.middleware';

@Resolver()
export class WishlistResolver {
  @Query(() => [Product])
  @UseMiddleware(Auth)
  async wishlists(@Ctx() { user }: ContextWithUser) {
    return user.wishlists;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async addToWishlist(
    @Arg('productId') id: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<Boolean> {
    const product = await Product.findOne({ id });
    if (!product) throw new UserInputError('Product not found');

    user.wishlists.push(product);
    await user.save();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async removeFromWishlist(
    @Arg('productId') id: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<Boolean> {
    const product = await Product.findOne({ id });
    if (!product) throw new UserInputError('Product not found');

    _.remove(user.wishlists, product => product.id === id);
    await user.save();

    return true;
  }
}
