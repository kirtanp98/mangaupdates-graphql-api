import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MangaService } from './manga.service';
import { Manga } from './entities/manga.entity';

@Resolver(() => Manga)
export class MangaResolver {
  constructor(private readonly mangaService: MangaService) {}

  @Query(() => Manga, { name: 'manga' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.mangaService.findOne(id);
  }
}
