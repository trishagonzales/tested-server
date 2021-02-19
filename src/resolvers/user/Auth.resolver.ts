import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-express';
import { User } from '../../entities/User.entity';
import { LoginInput } from './inputs/Auth.input';
import { ContextWithoutUser, ContextWithUser } from '../../types/Apollo.types';

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
      req.session!.userID = user.id;
      return user;
    }

    const userByUsername = await User.findOne(
      { username },
      { relations: ['wishlist', 'cart', 'cart.product'] }
    );
    if (userByUsername) return exec(userByUsername);

    const userByEmail = await User.findOne(
      { email: username },
      { relations: ['wishlist', 'cart', 'cart.product'] }
    );
    if (userByEmail) return exec(userByEmail);

    throw new Error('Invalid username or password');
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { session, res }: ContextWithUser): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      session.destroy(err => {
        if (err) {
          return reject(false);
        }

        res.clearCookie('cid');
        return resolve(true);
      });
    });
  }
}
