import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { Product } from './Product.entity';
import { CartItem } from './CartItem.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  firstname: string;

  @Field()
  @Column()
  lastname: string;

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
  createdAt: Date;

  @Field(() => [Product], { nullable: true, defaultValue: [] })
  @ManyToMany(type => Product)
  @JoinTable()
  wishlists: Product[];

  @Field(() => [CartItem], { nullable: true, defaultValue: [] })
  @ManyToMany(type => CartItem)
  @JoinTable()
  cart: CartItem[];

  @Column({ type: 'enum', enum: Object.keys(Role), default: Role.USER })
  role: Role;

  public validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }
}
