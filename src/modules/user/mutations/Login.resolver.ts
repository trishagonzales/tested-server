import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '@entities/User.entity';
import { LoginInput } from './inputs/LoginInput';
import { MyContext } from '../../../types/apollo.types';

@Resolver()
export class LoginResolver {
	@Mutation(() => User)
	async login(@Arg('input') { username, password }: LoginInput, @Ctx() { session }: MyContext): Promise<User> {
		const userByUsername = await User.findOne({ username });
		if (userByUsername) {
			const isPassValid = await userByUsername.validatePassword(password);
			if (!isPassValid) throw new Error('Invalid username or password');
			session.userId = userByUsername.id;
			return userByUsername;
		}
		const userByEmail = await User.findOne({ email: username });
		if (userByEmail) {
			const isPassValid = await userByEmail.validatePassword(password);
			if (!isPassValid) throw new Error('Invalid username or password');
			session.userId = userByEmail.id;
			return userByEmail;
		}

		throw new Error('Account not registered');
	}
}
