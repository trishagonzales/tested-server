import { User } from '../entities/User.entity';
import { Product } from '../entities/Product.entity';

declare global {
  namespace Express {
    export interface Session {
      userId: string;
    }

    export interface Request {
      product?: Product;
    }
  }
}
