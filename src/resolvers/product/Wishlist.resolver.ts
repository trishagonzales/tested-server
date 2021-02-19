import { Resolver, Mutation, Arg, Ctx, Query, UseMiddleware } from 'type-graphql';
import _ from 'lodash';

import { Product } from '../../entities/Product.entity';
import { AuthWithWishlist } from '../middlewares/Auth.middleware';
import { ContextWithUser } from '../../types/Apollo.types';
import { getProductById } from '../../utils/dbQueries.util';

@Resolver()
export class WishlistResolver {
  @Query(() => [Product])
  @UseMiddleware(AuthWithWishlist)
  async wishlistItems(@Ctx() { user }: ContextWithUser) {
    return user.wishlist;
  }

  @Mutation(() => Product)
  @UseMiddleware(AuthWithWishlist)
  async addWishlistItem(
    @Arg('productID') id: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<Product> {
    const product = await getProductById(id);

    user.wishlist.push(product);
    await user.save();

    return product;
  }

  @Mutation(() => Product)
  @UseMiddleware(AuthWithWishlist)
  async removeWishlistItem(
    @Arg('productID') id: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<Product> {
    const product = await getProductById(id);

    _.remove(user.wishlist, product => product.id === id);
    await user.save();

    return product;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthWithWishlist)
  async clearWishlist(@Ctx() { user }: ContextWithUser): Promise<boolean> {
    user.wishlist = [];
    await user.save();

    return true;
  }
}
