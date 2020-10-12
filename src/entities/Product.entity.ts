import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Float, Int } from 'type-graphql';
import { Review } from './Review.entity';

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
  @Column()
  description: string;

  @Field(() => Float)
  @Column()
  price: number;

  @Field(() => Int)
  @Column()
  stock: number;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @Column('simple-array', { default: [] })
  images: string[];

  @Field()
  @CreateDateColumn()
  postedAt: Date;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @Column({ default: 0 })
  averageRating: number;

  @Field(() => [Review], { nullable: true, defaultValue: [] })
  @OneToMany(type => Review, review => review.product)
  reviews: Review[];
}
