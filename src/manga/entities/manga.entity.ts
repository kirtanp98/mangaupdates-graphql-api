import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Manga {
  @Field(() => Int, { description: 'Manga Id' })
  id: number;

  @Field({ description: 'Description of the Manga' })
  description: string;
}
