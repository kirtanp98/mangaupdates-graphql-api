import { Args, Int, Resolver, Subscription } from '@nestjs/graphql';
import { RssFeedService } from './rss-feed.service';
import { RssFeed } from './entities/rss-feed.entity';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { SkipThrottle } from '@nestjs/throttler';

@Resolver(() => RssFeed)
export class RssFeedResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    private readonly rssFeedService: RssFeedService,
  ) {}

  @SkipThrottle()
  @Subscription(() => RssFeed, {
    name: 'rssFeed',
    filter: (payload, variables) =>
      variables.seriesId ? payload.rssFeed.id === variables.seriesId : true,
  })
  orderPlaced(
    @Args('seriesId', { type: () => Int, nullable: true }) seriesId?: number,
  ) {
    return this.pubSub.asyncIterator('rssFeed');
  }
}
