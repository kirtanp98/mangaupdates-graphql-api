import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { MangaModule } from './manga/manga.module';
import { ScrapperModule } from './scrapper/scrapper.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      playground: true,
    }),
    MangaModule,
    ScrapperModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
