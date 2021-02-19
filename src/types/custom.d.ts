import { Product } from '../entities/Product.entity';

declare global {
  namespace Express {
    export interface Session {
      userID: string;
    }

    export interface Request {
      product?: Product;
    }
  }
}
