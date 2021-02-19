import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Min, Max } from 'class-validator';
import { Product } from './Product.entity';
import { User } from './User.entity';

export type RatingType = 1 | 2 | 3 | 4 | 5;

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Min(1)
  @Max(5)
  @Column()
  rating: RatingType;

  @Field({ nullable: true })
  @Column('longtext', { nullable: true })
  comment?: string;

  @Field(() => User)
  @ManyToOne(() => User)
  author: User;

  @Field()
  @CreateDateColumn()
  datePosted: Date;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;
}
