import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { UserInputError } from 'apollo-server-express';
import { User } from '../../entities/User.entity';
import { SignupInput } from './inputs/SignupInput';
import { ContextWithoutUser } from '../../types/ApolloTypes';

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async signup(
    @Arg('input') input: SignupInput,
    @Ctx() { req }: ContextWithoutUser
  ): Promise<User> {
    const user = await User.findOne({ email: input.email });
    if (user) throw new UserInputError('User already registered');

    const newUser = await User.create({
      ...input,
      password: await User.hashPassword(input.password),
    }).save();

    req.session!.userId = newUser.id;

    return newUser;
  }

  @Mutation(() => Boolean)
  async isUsernameTaken(@Arg('username') username: string): Promise<boolean> {
    const usernameExist = await User.findOne({ username });
    if (usernameExist) return false;
    return true;
  }
}
