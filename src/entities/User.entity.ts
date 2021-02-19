import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { Product } from './Product.entity';
import { CartItem } from './CartItem.entity';
import { Order } from './Order.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'enum', enum: Object.keys(Gender) })
  gender?: Gender;

  @Field({ nullable: true })
  @Column({ nullable: true })
  birthdate?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ default: false })
  emailConfirmed: boolean;

  @Column()
  password: string;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product)
  @JoinTable()
  wishlist: Product[];

  @Field(() => [CartItem], { nullable: true })
  @OneToMany(() => CartItem, item => item.user)
  cart: CartItem[];

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @Column({ type: 'enum', enum: Object.keys(Role), default: Role.USER })
  role: Role;

  public validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }
}
