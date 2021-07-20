import { Resolver, Query, Ctx, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { CartItem } from '../../entities/CartItem.entity';
import { AuthWithCart } from '../middlewares/Auth.middleware';
import { AddCartItemInput, UpdateCartItemInput } from './inputs/Cart.input';
import { getProductById, getCartItemById } from '../../utils/dbQueries.util';
import { ContextWithUser } from '../../types/Apollo.types';

@Resolver()
export class CartResolver {
  @Query(() => [CartItem]!)
  @UseMiddleware(AuthWithCart)
  async cartItems(@Ctx() { user }: ContextWithUser): Promise<CartItem[]> {
    return user.cart;
  }

  @Mutation(() => CartItem!)
  @UseMiddleware(AuthWithCart)
  async addCartItem(
    @Arg('input') { productID, quantity, isIncluded }: AddCartItemInput,
    @Ctx() { user }: ContextWithUser
  ): Promise<CartItem> {
    const product = await getProductById(productID);
    const cartItem = await CartItem.findOne(
      { product: { id: productID }, user },
      { relations: ['product', 'user'] }
    );

    if (cartItem) {
      cartItem.quantity = cartItem.quantity + quantity;
      await cartItem.save();
      return cartItem;
    }

    const newCartItem = await CartItem.create({ product, quantity, isIncluded }).save();
    user.cart.push(newCartItem);
    await user.save();
    return newCartItem;
  }

  @Mutation(() => CartItem, { nullable: true })
  @UseMiddleware(AuthWithCart)
  async deleteCartItem(
    @Arg('productID') productID: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<CartItem | undefined> {
    const cartItem = await CartItem.findOne(
      {
        product: { id: productID },
        user: { id: user.id },
      },
      { relations: ['product', 'user'] }
    );

    if (cartItem) {
      const id = cartItem?.id;
      await CartItem.remove(cartItem);
      cartItem!.id = id;
    }

    return cartItem;
  }

  @Mutation(() => CartItem!)
  @UseMiddleware(AuthWithCart)
  async updateCartItem(@Arg('input') input: UpdateCartItemInput): Promise<CartItem> {
    const cartItem = await getCartItemById(input.id);
    cartItem.quantity = input.quantity;
    cartItem.isIncluded = input.isIncluded;
    await cartItem.save();

    return cartItem;
  }

  @Mutation(() => Boolean!)
  @UseMiddleware(AuthWithCart)
  async clearCart(@Ctx() { user }: ContextWithUser): Promise<boolean> {
    await CartItem.remove(user.cart);
    return true;
  }
}
