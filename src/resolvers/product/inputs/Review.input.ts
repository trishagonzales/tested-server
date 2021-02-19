import { InputType, Field, Int } from 'type-graphql';
import { RatingType } from '../../../entities/Review.entity';

@InputType()
export class CreateReviewInput {
  @Field(() => Int)
  rating: RatingType;

  @Field()
  comment: string;

  @Field()
  orderID: string;
}
