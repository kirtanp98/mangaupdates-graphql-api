import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { GqlThrottlerGuard } from './guard/GraphQLGuard';
import { SeriesModule } from './series/series.module';
import { ScraperModule } from './scraper/scraper.module';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    SeriesModule,
    ScraperModule,
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
