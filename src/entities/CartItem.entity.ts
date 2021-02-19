import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './Product.entity';
import { User } from './User.entity';

@ObjectType()
@Entity()
export class CartItem extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field()
  @Column()
  isIncluded: boolean;

  @ManyToOne(() => User)
  user: User;
}
