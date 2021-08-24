import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { GqlThrottlerGuard } from './guard/GraphQLGuard';
import { SeriesModule } from './series/series.module';
import { ScraperModule } from './scraper/scraper.module';
import { CacheService } from './cache/cache.service';
import { SearchModule } from './search/search.module';
import { RssFeedModule } from './rss-feed/rss-feed.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        keepAlive: 10000,
      },
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    SeriesModule,
    ScraperModule,
    SearchModule,
    RssFeedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    CacheService,
  ],
})
export class AppModule {}
