import { InputType, Field } from 'type-graphql';

@InputType()
export class SignupInput {
  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
