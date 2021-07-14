import { Resolver, Query } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { Search } from './entities/search.entity';
import fetch from 'node-fetch';
imp

@Resolver(() => Search)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => Search, { name: 'search' })
  async search() {
    // fetch(this.searchService.get(id));
    const params = new URLSearchParams();
    params.append('search', 'naruto');

    const data = await fetch('https://www.mangaupdates.com/search.html', {
      method: 'POST',
      body: params,
    });
    const html = await data.text();

    return 'hi';
  }
}
