import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { ItemsPerPage, ResultType } from './search.enum';

@ObjectType()
export class Search {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

@InputType()
export class SearchInput {
  @Field(() => String, { description: 'What to search for' })
  search: string;

  @Field(() => ResultType, {
    description: 'Result types you want to return',
  })
  resultTypes: ResultType;

  @Field(() => Int, { description: 'Page' })
  page: number;

  @Field(() => ItemsPerPage, { description: 'Items per page' })
  perPage: ItemsPerPage;
}
