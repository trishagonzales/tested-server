import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterInput {
	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	username: string;

	@Field()
	email: string;

	@Field()
	password: string;
}
