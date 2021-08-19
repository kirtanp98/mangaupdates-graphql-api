import { Resolver, Subscription } from '@nestjs/graphql';
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
  ) {
    setInterval(() => {
      const temp = new RssFeed();
      temp.exampleField = 1;
      this.pubSub.publish('rssFeed', { rssFeed: temp });
    }, 2000);
  }

  @SkipThrottle()
  @Subscription(() => RssFeed, {
    name: 'rssFeed',
  })
  orderPlaced() {
    return this.pubSub.asyncIterator('rssFeed');
  }
}
