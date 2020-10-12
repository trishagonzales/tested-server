import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../../entities/User.entity';
import { LoginInput } from './inputs/LoginInput';
import { ContextWithoutUser, ContextWithUser } from '../../types/ApolloTypes';
import { AuthenticationError } from 'apollo-server-express';
import { logger } from '../../utils/logger';

const log = logger.extend('auth-resolver');

@Resolver()
export class AuthResolver {
  @Mutation(() => User)
  async login(
    @Arg('input') { username, password }: LoginInput,
    @Ctx() { req }: ContextWithoutUser
  ): Promise<User> {
    async function exec(user: User) {
      const isPassValid = await user.validatePassword(password);
      if (!isPassValid) throw new AuthenticationError('Invalid username or password');
      req.session!.userId = user.id;
      return user;
    }

    const userByUsername = await User.findOne({ username }, { relations: ['wishlists', 'cart'] });
    if (userByUsername) return exec(userByUsername);

    const userByEmail = await User.findOne(
      { email: username },
      { relations: ['wishlists', 'cart'] }
    );
    if (userByEmail) return exec(userByEmail);

    throw new Error('Account not registered');
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { session, res }: ContextWithUser): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      session.destroy(err => {
        if (err) {
          log(err);
          return reject(false);
        }

        res.clearCookie('cid');
        return resolve(true);
      });
    });
  }
}
