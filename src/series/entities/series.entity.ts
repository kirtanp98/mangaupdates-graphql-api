import {
  ObjectType,
  Field,
  Int,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import {
  Period,
  SeriesGenre,
  SeriesStatus,
  SeriesType,
  RelatedType,
} from './type.enum';

@ObjectType()
export class ForumStats {
  @Field(() => Int, { description: 'Number of topics on the forum' })
  topics: number;

  @Field(() => Int, { description: 'Number of posts on the forum' })
  posts: number;
}

@ObjectType()
export class SeriesRatings {
  @Field(() => Int, { description: 'Votes' })
  votes: number;

  @Field(() => Float, { description: 'Average rating of the series' })
  average: number;

  @Field(() => Float, { description: 'Bayesian average rating of the series' })
  bayesianAverage: number;

  @Field(() => [Int], { description: 'Rating distribution from 10 to 0' })
  distribution: number[];
}

@ObjectType()
export class Series {
  @Field(() => Int, { description: 'Series Id' })
  id: number;

  @Field({ description: 'Title of the series' })
  title: string;

  @Field({ description: 'Description of the series' })
  description: string;

  @Field(() => SeriesType, { description: 'Type of the series' })
  type: SeriesType;

  @Field(() => [SeriesRelation], { description: 'Related series' })
  related: SeriesRelation[];

  @Field(() => [String], {
    description: 'Name of the series, often in other languages',
  })
  associatedName: string[];

  @Field(() => [GroupData], {
    description: 'Scanlations groups that have releases for the series',
  })
  groups: GroupData[]; //will be replaced with group data when the endpoint exists

  @Field(() => [String], { description: 'Latest releases for the series' })
  releases: string[]; //will be improved on later on, too much work for me right now

  @Field(() => SeriesStatus, { description: 'Status of the series' })
  status: SeriesStatus;

  @Field({ description: 'If the series is completely scanlated' })
  fullyScanlated: boolean;

  @Field({
    description:
      'Which chapters the anime, if the series has one otherwise empty, starts and ends',
  })
  animeChapters: string; //improve no clue how its structured

  @Field(() => [Int], { description: 'User reviews of the series' })
  userReviews: number[]; //this will get improved on whenever I get to users/forums

  @Field(() => ForumStats, { description: 'Forum stats of the series' })
  forumStats: ForumStats;

  @Field(() => SeriesRatings, { description: 'User ratings of the series' })
  ratings: SeriesRatings;

  @Field(() => GraphQLISODateTime, {
    description: 'Last time the page was updated',
  })
  lastUpdated: Date;

  @Field({
    description: 'URL of the cover image from the series',
    nullable: true,
  })
  image?: string;

  @Field(() => [SeriesGenre], { description: 'Genres of the series' })
  genres: SeriesGenre[];

  @Field(() => [Category], { description: 'Categories of the series' })
  categories: Category[];

  @Field(() => [SeriesRelation], {
    description: 'Categories recommendations for the series',
  })
  categoriesRecommendations: SeriesRelation[]; //improvement coming later

  @Field(() => [SeriesRelation], {
    description: 'Recommendations for the series',
  })
  recommendations: SeriesRelation[]; //improvement coming later

  @Field(() => [String], { description: 'Authors for the series' })
  authors: string[]; //improvement coming later

  @Field(() => [String], { description: 'Artist for the series' })
  artist: string[]; //improvement coming later

  @Field(() => Int, { description: 'Year of release' })
  year: number;

  @Field(() => [String], { description: 'Original publisher of the series' })
  originalPublishers: string[]; //improvement coming later

  @Field(() => [String], { description: 'Where the series was serialized' })
  serializedMagazines: string[];

  @Field({ description: 'Is the series licensed in english' })
  licensed: boolean;

  @Field(() => [String], {
    description: 'English publisher of the series',
    nullable: true,
  })
  englishPublishers?: string[];

  @Field(() => [ActivityStat], {
    description: 'User activity stats of the series',
  })
  activityStats: ActivityStat[];

  @Field(() => [ListStat], {
    description: 'List stats of the series',
  })
  listStats: ListStat[];

  @Field(() => GraphQLISODateTime, {
    description: 'When the series was cached',
  })
  cached: Date;
}

@ObjectType()
export class SeriesRelation {
  @Field(() => Int, { description: 'id of the series' })
  id: number;

  @Field({ description: 'Name of the series' })
  name: string;

  @Field(() => RelatedType, {
    description: 'Relationship of the series towards the parent series',
    nullable: true,
  })
  type?: RelatedType;

  // @Field(() => Series, { description: 'Related Series' })
  // type: Series;
}

@ObjectType()
export class GroupData {
  @Field(() => Int, { description: 'id of the group', nullable: true })
  id?: number;

  @Field({ description: 'Name of the group' })
  name: string;
}

@ObjectType()
export class ActivityStat {
  @Field(() => Period, { description: 'Period of time' })
  dateRange: Period;

  @Field(() => Int, { description: 'Position of the series' })
  position: number;

  @Field(() => Int, { description: 'Position change of the series' })
  change: number;
}

@ObjectType()
export class ListStat {
  @Field({ description: 'List' })
  list: string;

  @Field(() => Int, {
    description: 'Number of times the series appears on a list',
  })
  amount: number;
}

@ObjectType()
export class Category {
  @Field(() => Int, {
    description: 'Score/relevancy of the category',
  })
  score: number;

  @Field({
    description: 'The name of the category',
  })
  name: string;
}
