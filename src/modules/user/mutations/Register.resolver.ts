import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '@entities/User.entity';
import { RegisterInput } from './inputs/RegisterInput';

@Resolver()
export class RegisterResolver {
	@Mutation(() => User)
	async register(@Arg('input') input: RegisterInput): Promise<User> {
		const user = await User.findOne(input.email);
		if (user) throw new Error('User already registered');

		const newUser = await User.create({
			...input,
			password: await User.hashPassword(input.password),
		}).save();

		return newUser;
	}
}
