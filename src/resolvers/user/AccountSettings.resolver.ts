import { Resolver, Query, UseMiddleware, Ctx, Mutation, Arg } from 'type-graphql';
import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { User } from '../../entities/User.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { ContextWithUser } from '../../types/Apollo.types';

@Resolver()
export class AccountSettingsResolver {
  @Query(() => User)
  @UseMiddleware(Auth)
  async userData(@Ctx() { user }: ContextWithUser): Promise<User> {
    return user;
  }

  @Query(() => Boolean)
  @UseMiddleware(Auth)
  async isAdmin(@Ctx() { user }: ContextWithUser): Promise<boolean> {
    return /admin/i.test(user.role);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async validatePassword(
    @Arg('password') password: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<boolean> {
    const isValid = await user.validatePassword(password);
    if (!isValid) throw new AuthenticationError('Invalid password');
    return true;
  }

  @Mutation(() => String)
  @UseMiddleware(Auth)
  async updateUsername(@Arg('username') username: string, @Ctx() { user }: ContextWithUser) {
    const isUsernameAlreadyTaken = await User.findOne({ where: { username } });
    if (isUsernameAlreadyTaken) throw new UserInputError('Username already taken');
    if (username === user.username) throw new UserInputError('Cannot use current username');

    user.username = username;
    await user.save();

    return username;
  }

  @Mutation(() => String)
  @UseMiddleware(Auth)
  async updateEmail(
    @Arg('email') email: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<string> {
    const isEmailAlreadyTaken = await User.find({ where: { email } });
    if (isEmailAlreadyTaken) throw new UserInputError('Email already registered');
    if (email === user.email) throw new UserInputError('Cannot use current email');

    user.email = email;
    await user.save();

    return email;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async updatePassword(@Arg('password') password: string) {}

  @Mutation(() => User)
  @UseMiddleware(Auth)
  async deleteAccount(@Ctx() { user }: ContextWithUser): Promise<User> {
    const deletedUser = await User.remove(user);
    return deletedUser;
  }
}
