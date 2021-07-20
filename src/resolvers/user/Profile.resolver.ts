import { Resolver, Ctx, Mutation, UseMiddleware, Arg, FieldResolver, Root } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { User } from '../../entities/User.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { ProfileInput } from './inputs/Profile.input';
import { ContextWithUser } from '../../types/Apollo.types';
import { fileUpload, getFile, removeFile } from '../../utils/file.util';
import { UserInputError } from 'apollo-server-express';

@Resolver(User)
export class ProfileResolver {
  @FieldResolver(() => String)
  async avatar(@Root() { avatar }: User): Promise<string | null> {
    return getFile(avatar);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async uploadAvatar(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Ctx() { user }: ContextWithUser
  ): Promise<boolean> {
    const newFilename = fileUpload(file);
    if (user.avatar) await removeFile(newFilename);
    user.avatar = newFilename;
    await user.save();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async deleteAvatar(@Ctx() { user }: ContextWithUser): Promise<boolean> {
    if (!user.avatar) throw new UserInputError('avatar already removed');
    await removeFile(user.avatar);
    user.avatar = undefined;
    await user.save();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async updateProfile(@Arg('input') input: ProfileInput, @Ctx() { user }: ContextWithUser) {
    const { name, gender, month, day, year } = input;

    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (month && day && year)
      user.birthdate = `${month.toString()}/${day.toString()}/${year.toString()}`;

    try {
      if (input) await user.save();
      return true;
    } catch (e) {
      throw e;
    }
  }
}
