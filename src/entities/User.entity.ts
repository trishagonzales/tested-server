import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import bcrypt from 'bcryptjs';

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column()
	firstName: string;

	@Field()
	@Column()
	lastName: string;

	@Field()
	@Column({ unique: true })
	username: string;

	@Field()
	@Column({ unique: true })
	email: string;

	@Field()
	@Column({ default: false })
	emailConfirmed: boolean;

	@Field()
	@Column()
	password: string;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	public validatePassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
	}

	public static async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, await bcrypt.genSalt(10));
	}
}
