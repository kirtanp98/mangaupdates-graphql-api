import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { Search, SearchInput } from './entities/search.entity';

@Resolver(() => Search)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => Search, { name: 'search' })
  async search(@Args('searchInput') searchInput: SearchInput) {
    return this.searchService.orchestrateSearch(searchInput);
  }
}
