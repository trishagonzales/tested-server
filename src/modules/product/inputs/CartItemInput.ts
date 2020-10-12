import { InputType, Field } from 'type-graphql';
import { CartItem } from '../../../entities/CartItem.entity';

@InputType()
export class CartItemInput {
  @Field()
  productID: string;

  @Field()
  quantity: number;

  @Field()
  isIncluded: boolean;
}
