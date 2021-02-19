import { Resolver, Query, UseMiddleware } from 'type-graphql';
import { User } from '../../entities/User.entity';
import { Auth } from '../middlewares/Auth.middleware';
import { IsAdmin } from '../middlewares/IsAdmin.middleware';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(Auth, IsAdmin)
  async users(): Promise<User[]> {
    const users = await User.find({});
    return users;
  }
}
