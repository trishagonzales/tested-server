import _ from 'lodash';
import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { Product } from '../../entities/Product.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { IsAdmin } from '../middlewares/IsAdmin.middleware';
import { AddProductInput, UpdateProductInput } from './inputs/Product.input';
import { getProductById } from '../../utils/dbQueries.util';
import { fileUpload, removeFile } from '../../utils/file.util';
import { logger } from '../../utils/logger.util';

const log = logger.extend('prod-settings-resolver');

@Resolver()
export class ProductSettingsResolver {
  @Mutation(() => Product)
  @UseMiddleware(Auth, IsAdmin)
  async addProduct(@Arg('input') input: AddProductInput): Promise<Product> {
    const product = await Product.create({ ...input, images: [], rating: 0, reviews: [] }).save();
    return product;
  }

  @Mutation(() => Product)
  @UseMiddleware(Auth, IsAdmin)
  async updateProduct(@Arg('input') input: UpdateProductInput): Promise<Product> {
    await Product.update({ id: input.id }, { ...input });
    const updatedProduct = await getProductById(input.id);
    return updatedProduct;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth, IsAdmin)
  async deleteProduct(@Arg('id') id: string): Promise<boolean> {
    const product = await getProductById(id);
    await Promise.all(product.images.map(i => removeFile(i)));
    await Product.remove(product);

    return true;
  }

  @Mutation(() => String)
  @UseMiddleware(Auth, IsAdmin)
  async uploadProductImages(
    @Arg('id') id: string,
    @Arg('files', () => [GraphQLUpload]) files: Promise<FileUpload>[]
  ): Promise<string> {
    const filenames = await Promise.all(files.map(async file => fileUpload(await file)));

    const product = await getProductById(id);
    product.images = [...product.images, ...filenames];
    await product.save();

    return id;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth, IsAdmin)
  async deleteProductImages(
    @Arg('id') id: string,
    @Arg('filenames', () => [String]) filenames: string[]
  ): Promise<boolean> {
    await Promise.all(filenames.map(f => removeFile(f)));
    const product = await getProductById(id);
    product.images = _.difference(product.images, filenames);

    return true;
  }
}
