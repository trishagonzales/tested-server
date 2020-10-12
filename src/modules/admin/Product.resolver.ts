import { Resolver, Query, Mutation, Authorized, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { Product } from '../../entities/Product.entity';
import { AddProductInput } from './inputs/AddProductInput';
import { UpdateProductInput } from './inputs/UpdateProductInput';
import { getProduct } from '../../utils/product';
import { logger } from '../../utils/logger';
import { ContextWithUser } from '../../types/ApolloTypes';
import { Auth } from '../middlewares/Auth.middleware';
import { IsAdmin } from '../middlewares/IsAuthorized.middleware';

const log = logger.extend('product-resolver');

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  @UseMiddleware(Auth, IsAdmin)
  async products(@Ctx() { user }: ContextWithUser): Promise<Product[]> {
    const products = await Product.find({});
    return products;
  }

  @Mutation(() => Product)
  @UseMiddleware(Auth, IsAdmin)
  async addProduct(@Arg('input') input: AddProductInput): Promise<Product> {
    const product = await Product.create({ ...input }).save();
    return product;
  }

  @Mutation(() => Product)
  @UseMiddleware(Auth, IsAdmin)
  async updateProduct(@Arg('input') input: UpdateProductInput): Promise<Product> {
    await Product.update({ id: input.id }, { ...input });
    const updatedProduct = await getProduct(input.id);
    return updatedProduct;
  }

  @Mutation(() => Product)
  @UseMiddleware(Auth, IsAdmin)
  async removeProduct(@Arg('id') id: string): Promise<Product> {
    const product = await getProduct(id);
    const removedProduct = await Product.remove(product);
    return removedProduct;
  }
}
