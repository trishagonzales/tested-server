import { Request, Response } from 'express';
import { User } from '../entities/User.entity';

export interface ContextWithoutUser {
  req: Request;
  res: Response;
}

export interface ContextWithUser extends ContextWithoutUser {
  session: Express.Session;
  user: User;
}
