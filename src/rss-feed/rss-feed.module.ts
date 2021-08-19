import { Module } from '@nestjs/common';
import { RssFeedService } from './rss-feed.service';
import { RssFeedResolver } from './rss-feed.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    RssFeedResolver,
    RssFeedService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class RssFeedModule {}
