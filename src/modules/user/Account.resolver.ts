import { Resolver, Query, UseMiddleware, Ctx, Mutation } from 'type-graphql';
import { User } from '../../entities/User.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { ContextWithUser } from '../../types/ApolloTypes';
import { logger } from '../../utils/logger';

const log = logger.extend('account-resolver');

@Resolver()
export class AccountResolver {
  @Query(() => User)
  @UseMiddleware(Auth)
  async userData(@Ctx() { user }: ContextWithUser): Promise<User> {
    return user;
  }

  // @Mutation()
  // @UseMiddleware(Auth)
  // async editEmail() {}

  @Mutation(() => User)
  @UseMiddleware(Auth)
  async deleteAccount(@Ctx() { user }: ContextWithUser): Promise<User> {
    const deletedUser = await User.remove(user);
    return deletedUser;
  }
}
