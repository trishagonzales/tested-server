import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID, Float, Int } from 'type-graphql';
import { Review } from './Review.entity';
import { User } from './User.entity';

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('longtext')
  description: string;

  @Field(() => Float)
  @Column()
  price: number;

  @Field(() => Int)
  @Column()
  stock: number;

  @Field(() => [String])
  @Column('simple-array')
  images: string[];

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  @CreateDateColumn()
  datePosted: Date;

  @Field(() => Float)
  @Column()
  rating: number;

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, review => review.product)
  reviews: Review[];
}
