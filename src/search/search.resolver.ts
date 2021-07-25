import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { Search, SearchInput } from './entities/search.entity';
import fetch from 'node-fetch';

@Resolver(() => Search)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => Search, { name: 'search' })
  async search(@Args('SearchInput') searchInput: SearchInput) {
    // fetch(this.searchService.get(id));
    // const params = new URLSearchParams();
    // params.append('search', 'naruto');

    // const data = await fetch('https://www.mangaupdates.com/search.html', {
    //   method: 'POST',
    //   body: params,
    // });
    // const html = await data.text();

    return this.searchService.orchestrateSearch(searchInput);
  }

}
