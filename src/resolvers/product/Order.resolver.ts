import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from 'type-graphql';
import { UserInputError } from 'apollo-server-express';
import { In } from 'typeorm';
import { Order, OrderItem, OrderStatus } from '../../entities/Order.entity';
import { CartItem } from '../../entities/CartItem.entity';
import { AuthWithOrders, Auth } from '../middlewares/Auth.middleware';
import { updateOrderStatus, getOrderById } from '../../utils/dbQueries.util';
import { ContextWithUser } from '../../types/Apollo.types';

@Resolver()
export class OrderResolver {
  @Query(() => [Order])
  @UseMiddleware(AuthWithOrders)
  async orders(@Ctx() { user }: ContextWithUser): Promise<Order[]> {
    return user.orders;
  }

  @Mutation(() => Order)
  @UseMiddleware(AuthWithOrders)
  async createOrder(
    @Arg('cartIDs', () => [String]) cartIDs: String[],
    @Ctx() { user }: ContextWithUser
  ): Promise<Order> {
    const cartItems = await CartItem.find({ where: { id: In(cartIDs) }, relations: ['product'] });
    if (cartItems.length === 0) throw new UserInputError('Cart items not found');

    const totalPrice = cartItems
      .map(i => i.product.price * i.quantity)
      .reduce((total, current) => total + current, 0);

    const items = await OrderItem.save(
      cartItems.map(({ product, quantity }) => OrderItem.create({ product, quantity }))
    );
    const order = await Order.create({ items, totalPrice }).save();

    user.orders.push(order);
    await user.save();

    setTimeout(updateOrderStatus(order.id, OrderStatus.PROCESSING), 1000 * 60 * 5);
    setTimeout(updateOrderStatus(order.id, OrderStatus.COMPLETED), 1000 * 60 * 5);
    await CartItem.remove(cartItems);

    return order;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async deleteOrder(@Arg('id') id: string): Promise<boolean> {
    const order = await getOrderById(id);
    await Order.remove(order);
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthWithOrders)
  async clearOrders(@Ctx() { user }: ContextWithUser): Promise<boolean> {
    await Order.remove(user.orders);
    return true;
  }
}
