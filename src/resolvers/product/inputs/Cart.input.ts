import { InputType, Field } from 'type-graphql';

@InputType()
export class AddCartItemInput {
  @Field()
  productID: string;

  @Field()
  quantity: number;

  @Field()
  isIncluded: boolean;
}

@InputType()
export class UpdateCartItemInput {
  @Field()
  id: string;

  @Field()
  quantity: number;

  @Field()
  isIncluded: boolean;
}
