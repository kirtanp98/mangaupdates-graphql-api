import { Injectable } from '@nestjs/common';
import {
  Search,
  SearchInput,
  SeriesSearchItem,
} from './entities/search.entity';
import { ItemsPerPage, ResultType } from './entities/search.enum';

@Injectable()
export class SearchService {
  orchestrateSearch(searchInput: SearchInput): Search {
    const searchResult = new Search();
    searchResult.page = searchInput.page ?? ItemsPerPage.TwentyFive;
    searchResult.perPage = searchInput.perPage ?? 1;

    switch (searchInput.resultTypes) {
      case ResultType.Authors:
        break;
      case ResultType.Publishers:
        break;
      case ResultType.Releases:
        break;
      case ResultType.Scanlators:
        break;
      case ResultType.Series:
        const [series, totalPages] = this.seriesSearch(searchInput);
        searchResult.series = series;
        searchResult.totalPages = totalPages;
        break;
      default:
        break;
    }

    return searchResult;
  }

  seriesSearch(searchInput: SearchInput): [SeriesSearchItem[], number] {
    return [[], 1];
  }
}
