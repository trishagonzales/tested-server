import { Product } from '../entities/Product.entity';
import { UserInputError } from 'apollo-server-express';

export async function getProduct(id: string, relations?: string[]) {
  let product: Product | undefined;
  if (relations) product = await Product.findOne({ id }, { relations });

  product = await Product.findOne({ id });
  if (!product) throw new UserInputError('product not found');

  return product;
}
