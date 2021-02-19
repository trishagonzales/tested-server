import _ from 'lodash';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';
import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { Review } from '../../entities/Review.entity';
import { User } from '../../entities/User.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { CreateReviewInput } from './inputs/Review.input';
import { ContextWithUser } from '../../types/Apollo.types';
import { getOrderById } from '../../utils/dbQueries.util';
import { getFile } from '../../utils/file.util';

@Resolver(Review)
export class ReviewResolver {
  @FieldResolver(() => String)
  async avatar(@Root() { author }: Review): Promise<string | null> {
    return getFile(author.avatar);
  }

  @FieldResolver()
  async author(@Root() { author }: Review): Promise<Partial<User>> {
    return _.pick(author, ['id', 'username', 'avatar']);
  }

  @Query(() => [Review])
  async reviews(@Arg('productID') productID: string): Promise<Review[]> {
    const reviews = await Review.find({
      where: { product: { id: productID } },
      relations: ['author'],
    });

    return reviews;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async createReview(
    @Arg('input') { orderID, rating, comment }: CreateReviewInput,
    @Ctx() { user }: ContextWithUser
  ): Promise<boolean> {
    const order = await getOrderById(orderID);
    if (order.isReviewed) throw new UserInputError('Already written a review');

    const products = order.items.map(i => i.product);
    await Promise.all(
      products.map(async product => {
        const review = await Review.create({ rating, comment, product, author: user }).save();
        product.reviews.push(review);
        return product.save();
      })
    );

    order.isReviewed = true;
    await order.save();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async deleteReview(@Arg('id') id: string, @Ctx() { user }: ContextWithUser): Promise<boolean> {
    const review = await Review.findOne({ id }, { relations: ['author'] });
    if (review?.author.id !== user.id) throw new ForbiddenError('Review does not belong to user');
    if (!review) throw new UserInputError('Review not found');
    await Review.remove(review);

    return true;
  }
}
