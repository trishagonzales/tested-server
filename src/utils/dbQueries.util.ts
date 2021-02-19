import { UserInputError } from 'apollo-server-express';
import { Product } from '../entities/Product.entity';
import { CartItem } from '../entities/CartItem.entity';
import { User } from '../entities/User.entity';
import { OrderStatus, Order } from '../entities/Order.entity';

export async function getUserById(id: string, relations?: string[]) {
  let user: User | undefined;

  if (relations) user = await User.findOne({ id }, { relations });
  if (!relations) user = await User.findOne({ id });
  if (!user) throw new UserInputError('user not found');

  return user;
}

export async function getProductById(id: string, relations?: string[]) {
  let product: Product | undefined;

  if (relations) product = await Product.findOne({ id }, { relations });
  if (!relations) product = await Product.findOne({ id });
  if (!product) throw new UserInputError('product not found');

  return product;
}

export async function getCartItemById(id: string) {
  const cartItem = await CartItem.findOne({ id }, { relations: ['product'] });
  if (!cartItem) throw new Error('cart item not found');
  return cartItem;
}

export async function getOrderById(id: string) {
  const order = await Order.findOne(
    { id },
    {
      join: {
        alias: 'order',
        leftJoinAndSelect: {
          items: 'order.items',
          product: 'items.product',
          reviews: 'product.reviews',
        },
      },
    }
  );
  if (!order) throw new Error('order not found');
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return async () => {
    const order = await Order.findOne({ id });
    if (order) {
      order.status = status;
      await order.save();
    }
  };
}

export async function ifNotFoundError(item: any, name: string) {
  if (!item) throw new UserInputError(`${name} not found`);
}
