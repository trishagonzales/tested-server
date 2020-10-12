import { InputType, Field } from 'type-graphql';

@InputType()
export class AddProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  stock: number;
}
