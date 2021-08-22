import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class RssFeed {
  @Field(() => Int, { description: 'Id of release' })
  id: number;

  @Field({ description: 'Title of release' })
  title: string;

  @Field({ description: 'Name of group', nullable: true })
  group?: string;

  @Field({ description: 'Content of release' })
  content: string;

  @Field(() => GraphQLISODateTime, {
    description: 'Last time the page was updated',
  })
  date: Date;
}
