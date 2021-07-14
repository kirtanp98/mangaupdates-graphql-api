import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Search {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
