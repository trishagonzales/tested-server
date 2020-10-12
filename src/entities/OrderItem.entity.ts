// import { ObjectType, Field, ID, Int, Float } from 'type-graphql';
// import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
// import { Product } from './Product.entity';

// @ObjectType()
// @Entity()
// export class OrderItem extends BaseEntity {
//   @Field(() => ID!)
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Field(() => Product)
//   @Column()
//   product: Product;

//   @Field(() => Int)
//   @Column()
//   quantity: number;

//   @Field(() => Float)
//   @Column()
//   price: number;

//   @Field(() => Date)
//   @CreateDateColumn()
//   date: Date;
// }
