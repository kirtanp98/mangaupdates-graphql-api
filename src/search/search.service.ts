import { Injectable } from '@nestjs/common';
import { URLSearchParams } from 'url';
import {
  Search,
  SearchInput,
  SeriesSearchItem,
} from './entities/search.entity';
import { ItemsPerPage, ResultType } from './entities/search.enum';

@Injectable()
export class SearchService {
  async orchestrateSearch(searchInput: SearchInput): Promise<Search> {
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
        const [series, totalPages] = await this.seriesSearch(searchInput);
        searchResult.series = series;
        searchResult.totalPages = totalPages;
        break;
      default:
        break;
    }

    return searchResult;
  }

  async seriesSearch(
    searchInput: SearchInput,
  ): Promise<[SeriesSearchItem[], number]> {
    const params = this.seriesSearchParamBuilder(searchInput);

    const data = await fetch('https://www.mangaupdates.com/search.html', {
      method: 'POST',
      body: params,
    });
    const html = await data.text();

    return [[], 1];
  }

  private seriesSearchParamBuilder(searchInput: SearchInput): URLSearchParams {
    const searchParams = new URLSearchParams();
    searchParams.append('search', searchInput.search);
    searchParams.append('orderby', searchInput.sortModel.field);

    return searchParams;
  }
}