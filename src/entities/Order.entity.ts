import { ObjectType, Field, ID, Int, Float, registerEnumType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './Product.entity';
import { User } from './User.entity';

export enum OrderStatus {
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @Field(() => Float)
  @Column()
  totalPrice: number;

  @Field(() => OrderStatus)
  @Column({ type: 'enum', enum: Object.keys(OrderStatus), default: OrderStatus.CONFIRMED })
  status: OrderStatus;

  @Field(() => Date)
  @CreateDateColumn()
  date: Date;

  @Field()
  @Column({ default: false })
  isReviewed: boolean;

  @ManyToOne(() => User)
  user: User;
}

@ObjectType()
@Entity()
export class OrderItem extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Product, { nullable: true })
  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  product: Product;

  @Field(() => Int)
  @Column()
  quantity: number;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  order: Order;
}
