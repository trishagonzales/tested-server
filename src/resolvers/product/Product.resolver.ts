import { Resolver, Query, FieldResolver, Root, Arg } from 'type-graphql';
import { Product } from '../../entities/Product.entity';
import { getProductById } from '../../utils/dbQueries.util';
import { getFile } from '../../utils/file.util';

@Resolver(Product)
export class ProductResolver {
  @FieldResolver(() => String)
  async thumbnail(@Root() { images }: Product) {
    return getFile(images[0]);
  }

  @FieldResolver(() => [String])
  async images(@Root() { images }: Product) {
    return images.map(image => getFile(image));
  }

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    const products = await Product.find();
    return products;
  }

  @Query(() => Product)
  async product(@Arg('id') id: string): Promise<Product> {
    const product = await getProductById(id, ['reviews', 'reviews.author']);
    return product;
  }
}
