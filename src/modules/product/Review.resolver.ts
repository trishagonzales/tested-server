import { Resolver, Query, Arg, Mutation, UseMiddleware, Ctx } from 'type-graphql';
import { Review } from '../../entities/Review.entity';
import { Product } from '../../entities/Product.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { ContextWithoutUser, ContextWithUser } from '../../types/ApolloTypes';
import { ReviewInput } from './inputs/ReviewInput';
import { getProduct } from '../../utils/product';

@Resolver()
export class ReviewResolver {
  @Query(() => [Review])
  async reviews(@Arg('productID') productID: string): Promise<Review[] | undefined> {
    const product = await Product.findOne({ id: productID }, { relations: ['reviews'] });
    return product?.reviews;
  }

  @Mutation(() => Review)
  @UseMiddleware(Auth)
  async createReview(
    @Arg('input') input: ReviewInput,
    @Ctx() { user }: ContextWithUser
  ): Promise<Review> {
    const product = await getProduct(input.productID);

    const newReview = await Review.create({
      rating: input.rating,
      comment: input.comment,
      product,
      author: user,
    }).save();

    product?.reviews?.push(newReview);
    await product.save();

    return newReview;
  }

  @Mutation(() => Review)
  @UseMiddleware(Auth)
  async deleteReview(@Arg('id') id: string) {
    const review = await Review.findOne({ id });
    if (review) await Review.remove(review);
    return review;
  }
}
