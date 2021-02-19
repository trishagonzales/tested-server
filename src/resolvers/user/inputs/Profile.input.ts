import { InputType, Field, registerEnumType } from 'type-graphql';
import { Gender } from '../../../entities/User.entity';
import { MaxLength, IsInt, Max, Min } from 'class-validator';

registerEnumType(Gender, { name: 'Gender' });

@InputType()
export class ProfileInput {
  @Field({ nullable: true })
  @MaxLength(128)
  name?: string;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field({ nullable: true })
  @Max(12, { message: 'Month not valid' })
  @Min(1, { message: 'Month not valid' })
  month?: number;

  @Field({ nullable: true })
  @IsInt()
  @Max(31, { message: 'Day not valid' })
  @Min(1, { message: 'Day not valid' })
  day?: number;

  @Field({ nullable: true })
  year?: number;
}
