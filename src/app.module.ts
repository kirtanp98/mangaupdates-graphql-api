import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { GqlThrottlerGuard } from './guard/GraphQLGuard';
import { MangaModule } from './manga/manga.module';
import { ScrapperModule } from './scrapper/scrapper.module';

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
    MangaModule,
    ScrapperModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
