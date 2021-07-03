import {
  ObjectType,
  Field,
  Int,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import {
  Period,
  MangaGenre,
  MangaStatus,
  MangaType,
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
export class MangaRatings {
  @Field(() => Int, { description: 'Votes' })
  votes: number;

  @Field(() => Float, { description: 'Average rating of the manga' })
  average: number;

  @Field(() => Float, { description: 'Bayesian average rating of the manga' })
  bayesianAverage: number;

  @Field(() => Int, { description: 'Rating distribution from 10 to 0' })
  distribution: number[];
}

@ObjectType()
export class Manga {
  @Field(() => Int, { description: 'Manga Id' })
  id: number;

  @Field({ description: 'Title of the manga' })
  title: string;

  @Field({ description: 'Description of the manga' })
  description: string;

  @Field(() => MangaType, { description: 'Type of the manga' })
  type: MangaType;

  @Field(() => [MangaRelation], { description: 'Related manga' })
  related: MangaRelation[];

  @Field(() => [String], {
    description: 'Name of the manga, often in other languages',
  })
  associatedName: string[];

  @Field(() => [GroupData], {
    description: 'Scanlations groups that have releases for the manga',
  })
  groups: GroupData[]; //will be replaced with group data when the endpoint exists

  @Field(() => [String], { description: 'Latest releases for the manga' })
  releases: string[]; //will be improved on later on, too much work for me right now

  @Field(() => MangaStatus, { description: 'Status of the manga' })
  status: MangaStatus;

  @Field({ description: 'If the manga is completly scanlated' })
  fullyScanlated: boolean;

  @Field({
    description:
      'Which chapters the anime, if the manga has one otherwise empty, starts and ends',
  })
  animeChapters: string; //improve no clue how its structured

  @Field(() => [Int], { description: 'User reviews of the manga' })
  userReviews: number[]; //this will get improved on whenever I get to users/forums

  @Field(() => ForumStats, { description: 'Forum stats of the manga' })
  forumStats: ForumStats;

  @Field(() => MangaRatings, { description: 'User ratings of the manga' })
  ratings: MangaRatings;

  @Field(() => GraphQLISODateTime, {
    description: 'Last time the page was updated',
  })
  lastUpdated: Date;

  @Field({
    description: 'URL of the cover image from the manga',
    nullable: true,
  })
  image?: string;

  @Field(() => [MangaGenre], { description: 'Genres of the manga' })
  genres: MangaGenre[];

  @Field(() => [String], { description: 'Categories of the manga' })
  categories: string[];

  @Field(() => [String], {
    description: 'Categories recommendations for the manga',
  })
  categoriesRecommendations: string[]; //improvement coming later

  @Field(() => [String], { description: 'Recommendations for the manga' })
  recommendations: string[]; //improvement coming later

  @Field(() => [String], { description: 'Authors for the manga' })
  authors: string[]; //improvement coming later

  @Field(() => [String], { description: 'Artist for the manga' })
  artist: string[]; //improvement coming later

  @Field(() => Int, { description: 'Year of release' })
  year: number;

  @Field({ description: 'Original publisher of the manga' })
  originalPublisher: string;

  @Field({ description: 'Where the manga was serialized' })
  serializedMagazine: string;

  @Field({ description: 'Is the manga licensed in english' })
  licensed: boolean;

  @Field({ description: 'English publisher of the manga' })
  englishPublisher: string;

  @Field(() => [ActivityStat], {
    description: 'User activity stats of the manga',
  })
  activityStats: ActivityStat[];

  @Field(() => [ListStat], {
    description: 'List stats of the manga',
  })
  listStats: ListStat[];
}

@ObjectType()
export class MangaRelation {
  @Field(() => Int, { description: 'id of the manga' })
  id: number;

  @Field({ description: 'Name of the manga' })
  name: string;

  @Field(() => RelatedType, {
    description: 'Relationship of the manga towards the parent manga',
  })
  type: RelatedType;

  // @Field(() => Manga, { description: 'Related Manga' })
  // type: Manga;
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

  @Field(() => Int, { description: 'Position of the manga' })
  position: number;

  @Field(() => Int, { description: 'Position change of the manga' })
  change: number;
}

@ObjectType()
export class ListStat {
  @Field({ description: 'List' })
  list: string;

  @Field(() => Int, {
    description: 'Number of times the manga appears on a list',
  })
  amount: number;
}
