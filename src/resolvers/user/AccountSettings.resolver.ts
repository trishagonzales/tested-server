import { Resolver, Query, UseMiddleware, Ctx, Mutation, Arg } from 'type-graphql';
import { UserInputError, AuthenticationError } from 'apollo-server-express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { User } from '../../entities/User.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { ContextWithUser } from '../../types/Apollo.types';
import { Mail } from '../../utils/Mail.util';
import { getUserById } from '../../utils/dbQueries.util';
import { config } from '../../utils/config.util';

@Resolver()
export class AccountSettingsResolver {
  //  USER DATA

  @Query(() => User)
  @UseMiddleware(Auth)
  async userData(@Ctx() { user }: ContextWithUser): Promise<User> {
    return user;
  }

  //  IS ADMIN

  @Query(() => Boolean)
  @UseMiddleware(Auth)
  async isAdmin(@Ctx() { user }: ContextWithUser): Promise<boolean> {
    return /admin/i.test(user.role);
  }

  //  VALIDATE PASSWORD

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

  //  UPDATE USERNAME

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

  //  UPDATE EMAIL

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

  //  UPDATE PASSWORD

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async updatePassword(@Arg('password') password: string) {}

  //  DELETE ACCOUNT

  @Mutation(() => User)
  @UseMiddleware(Auth)
  async deleteAccount(@Ctx() { user }: ContextWithUser): Promise<User> {
    const deletedUser = await User.remove(user);
    return deletedUser;
  }

  //  FORGOT PASSWORD

  @Query(() => Boolean)
  async forgotPassword(@Arg('email') email: string) {
    const user = await User.findOne({ where: { email }, select: ['email'] });
    if (!user) throw new UserInputError('Account not found');
    const mail = new Mail(user.email);
    await mail.sendForgotPasswordLink(user.id);

    return true;
  }

  //  RESET PASSWORD

  @Mutation(() => Boolean)
  async resetPassword(@Arg('token') token: string, @Arg('newPassword') newPassword: string) {
    return new Promise<boolean | string>((res, rej) => {
      jwt.verify(token, config.JWT_KEY!, {}, async (err: VerifyErrors | null, decoded: any) => {
        if (err) rej('Access denied');
        const user = await getUserById(decoded.userID);
        user.password = await User.hashPassword(newPassword);
        await user.save();
        res(true);
      });
    });
  }

  //  SEND EMAIL CONFIRMATION LINK

  @Query(() => Boolean)
  @UseMiddleware(Auth)
  async sendEmailConfirmationLink(@Ctx() { user }: ContextWithUser) {
    const mail = new Mail(user.email);
    await mail.sendValidateEmailLink(user.id);

    return true;
  }

  //  CONFIRM EMAIL

  @Mutation(() => Boolean)
  async confirmEmail(@Arg('token') token: string) {
    return new Promise<boolean | string>((res, rej) => {
      jwt.verify(token, config.JWT_KEY!, {}, async (err: VerifyErrors | null, decoded: any) => {
        if (err) rej('Access denied');
        const user = await getUserById(decoded.userID);
        user.isEmailConfirmed = true;
        await user.save();
        res(true);
      });
    });
  }
}
