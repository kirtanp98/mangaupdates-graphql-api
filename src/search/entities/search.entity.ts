import { ObjectType, Field, Int, InputType, Float } from '@nestjs/graphql';
import { SeriesGenre } from 'src/series/entities/type.enum';
import { ItemsPerPage, OrderBy, ResultType } from './search.enum';

@ObjectType()
export class SeriesSearchItem {
  @Field(() => Int, { description: 'Series Id' })
  id: number;

  @Field({ description: 'Title of the series' })
  title: string;

  @Field({ description: 'Truncated description of the series' })
  description: string;

  @Field({
    description: 'URL of the cover image from the series',
    nullable: true,
  })
  image?: string;

  @Field(() => Int, { description: 'Year of release', nullable: true })
  year?: number;

  @Field(() => Boolean, {
    description: 'Indicates if a series is not safe for work',
  })
  nsfw: boolean;

  @Field(() => Float, { description: 'Rating of the series', nullable: true })
  average?: number;

  @Field(() => [SeriesGenre], { description: 'Genres of the series' })
  genres: SeriesGenre[];
}

@ObjectType()
export class Search {
  @Field(() => Int, { description: 'Total pages' })
  totalPages: number;

  @Field(() => Int, { description: 'Page number' })
  page: number;

  @Field(() => ItemsPerPage, {
    description: 'Items per page',
  })
  perPage?: ItemsPerPage;

  @Field(() => [SeriesSearchItem], {
    description: 'Series result',
    nullable: true,
  })
  series?: SeriesSearchItem[];
}

@InputType()
export class SortByModel {
  @Field(() => String, { description: 'What field to sort by' })
  field: string;

  @Field(() => OrderBy, {
    description: 'Order sort by',
    nullable: true,
    defaultValue: OrderBy.asc,
  })
  sort?: OrderBy;
}

@InputType()
export class SearchInput {
  @Field(() => String, { description: 'What to search for' })
  search: string;

  @Field(() => SortByModel, {
    description: 'How to sort results',
    nullable: true,
  })
  sortModel?: SortByModel;

  @Field(() => ResultType, {
    description: 'Result types you want to return',
  })
  resultTypes: ResultType;

  @Field(() => Int, { description: 'Page', nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => ItemsPerPage, {
    description: 'Items',
    nullable: true,
    defaultValue: ItemsPerPage.TwentyFive,
  })
  perPage?: ItemsPerPage;
}
