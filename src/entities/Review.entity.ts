import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Min, Max } from 'class-validator';
import { User } from './User.entity';
import { Product } from './Product.entity';

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
  @Column({ nullable: true })
  comment?: string;

  @Field(() => Product)
  @ManyToOne(type => Product)
  product: Product;

  @Field(() => User)
  @OneToOne(type => User, user => user.id)
  @JoinColumn()
  author: User;

  @Field()
  @CreateDateColumn()
  postedAt: Date;
}
