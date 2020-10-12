import { Resolver, Query, Ctx, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { CartItem } from '../../entities/CartItem.entity';
import { ContextWithUser } from '../../types/ApolloTypes';
import { Auth } from '../middlewares/Auth.middleware';
import { CartItemInput } from './inputs/CartItemInput';
import { Product } from '../../entities/Product.entity';
import { getProduct } from '../../utils/product';

@Resolver()
export class CartResolver {
  @Query(() => [CartItem])
  @UseMiddleware(Auth)
  async cartData(@Ctx() { user }: ContextWithUser): Promise<CartItem[]> {
    return user.cart;
  }

  @Mutation(() => CartItem)
  @UseMiddleware(Auth)
  async addCartItem(
    @Arg('item') { productID, quantity, isIncluded }: CartItemInput,
    @Ctx() { user }: ContextWithUser
  ): Promise<CartItem> {
    const product = await getProduct(productID);

    const cartItem = CartItem.create({ product, quantity, isIncluded });
    user.cart.push(cartItem);
    await user.save();

    return cartItem;
  }

  @Mutation(() => CartItem)
  @UseMiddleware(Auth)
  async removeCartItem(@Arg('id') id: string, @Ctx() { user }: ContextWithUser): Promise<CartItem> {
    const cartItem = await CartItem.findOne({ id });
    if (!cartItem) throw new Error('cart item not found');

    const newCartArray = user.cart.filter(item => item.id !== cartItem.id);
    user.cart = newCartArray;
    await user.save();

    return cartItem;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async clearCart(@Ctx() { user }: ContextWithUser): Promise<boolean> {
    user.cart = [];
    await user.save();

    return true;
  }
}
