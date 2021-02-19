import { Resolver, Ctx, Mutation, UseMiddleware, Arg, FieldResolver, Root } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { User } from '../../entities/User.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { ProfileInput } from './inputs/Profile.input';
import { ContextWithUser } from '../../types/Apollo.types';
import { fileUpload, getFile } from '../../utils/file.util';

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
    user.avatar = newFilename;
    await user.save();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async editProfile(@Arg('input') input: ProfileInput, @Ctx() { user }: ContextWithUser) {
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
