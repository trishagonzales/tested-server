import { Resolver, Query, UseMiddleware, Ctx } from 'type-graphql';
import { User } from '@entities/User.entity';
import { Auth } from '@modules/middlewares/auth.middleware';
import { MyContext } from '../../../types/apollo.types';

@Resolver()
export class UserDataResolver {
	@Query(() => User)
	@UseMiddleware(Auth)
	async userData(@Ctx() { session }: MyContext): Promise<User> {
		const user = await User.findOne({ id: session.userId });
		if (!user) throw new Error('No user found');

		return user;
	}
}
