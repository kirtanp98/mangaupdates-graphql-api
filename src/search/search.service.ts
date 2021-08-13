import { Injectable } from '@nestjs/common';
import { URLSearchParams } from 'url';
import {
  Contact,
  ReleaseSearchItem,
  ScanlatorSearchItem,
  Search,
  SearchInput,
  SeriesSearchItem,
} from './entities/search.entity';
import { ItemsPerPage, ResultType } from './entities/search.enum';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { SeriesSearchParser } from './parsers/SeriesSearchParser';
import { ReleaseSearchParser } from './parsers/ReleaseSearchParser';
import SharedFunctions from 'src/shared/SharedMethods';
import { ScanlationSearchParser } from './parsers/ScanlationSearchParser';

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
        const [releases, pages] = await this.releasesSearch(searchInput);
        searchResult.items = releases;
        searchResult.totalPages = pages;
        break;
      case ResultType.Scanlators:
        const [groups, p] = await this.scanlatorsSearch(searchInput);
        searchResult.items = groups;
        searchResult.totalPages = p;
        break;
      case ResultType.Series:
        const [series, totalPages] = await this.seriesSearch(searchInput);
        searchResult.items = series;
        searchResult.totalPages = totalPages;
        break;
      default:
        break;
    }

    return searchResult;
  }

  async scanlatorsSearch(
    searchInput: SearchInput,
  ): Promise<[ScanlatorSearchItem[], number]> {
    const url = this.scanlatorSearchURLBuilder(searchInput);
    const data = await fetch(url, {
      method: 'GET',
    });
    const html = await data.text();
    const $ = cheerio.load(html);

    const totalPages = Number(
      this.getTextInBrackets($('.d-none.d-md-inline-block').text()),
    );

    if (totalPages < searchInput.page) {
      throw new Error('Page out of limit');
    }

    const scanlationParser = new ScanlationSearchParser();
    await scanlationParser.parse($);
    const result = scanlationParser.getObject();

    return [result, totalPages];
  }

  async releasesSearch(
    searchInput: SearchInput,
  ): Promise<[ReleaseSearchItem[], number]> {
    const url = this.releaseSearchURLBuilder(searchInput);
    const data = await fetch(url, {
      method: 'GET',
    });
    const html = await data.text();
    const $ = cheerio.load(html);

    const totalPages = Number(
      this.getTextInBrackets($('.d-none.d-md-inline-block').text()),
    );

    if (totalPages < searchInput.page) {
      throw new Error('Page out of limit');
    }

    const searchParser = new ReleaseSearchParser();
    await searchParser.parse($);
    const result = searchParser.getObject();

    return [result, totalPages];
  }

  async seriesSearch(
    searchInput: SearchInput,
  ): Promise<[SeriesSearchItem[], number]> {
    const url = this.seriesSearchURLBuilder(searchInput);
    const body = this.seriesSearchBodyBuilder(searchInput);

    const data = await fetch(url, {
      method: 'POST',
      body: body,
    });
    const html = await data.text();
    const $ = cheerio.load(html);

    const totalPages = Number(
      this.getTextInBrackets($('.d-none.d-md-inline-block').text()),
    );

    if (totalPages < searchInput.page) {
      throw new Error('Page out of limit');
    }

    const searchParser = new SeriesSearchParser();
    await searchParser.parse($);
    const result = searchParser.getObject();

    return [result, totalPages];
  }

  private scanlatorSearchURLBuilder(searchInput: SearchInput): string {
    const url = 'https://www.mangaupdates.com/groups.html?';
    const searchParams = new URLSearchParams();

    searchParams.append('page', searchInput.page + '');
    searchParams.append('search', searchInput.search);
    searchParams.append('perpage', searchInput.perPage + '');

    //active=false
    return url + searchParams;
  }

  private releaseSearchURLBuilder(searchInput: SearchInput): string {
    //https://www.mangaupdates.com/releases.html?page=2&search=one+piece&act=archive&perpage=5&orderby=title&asc=desc

    const url = 'https://www.mangaupdates.com/releases.html?';
    const searchParams = new URLSearchParams();

    searchParams.append('page', searchInput.page + '');
    searchParams.append('search', searchInput.search);
    searchParams.append('act', 'archive');
    searchParams.append('perpage', searchInput.perPage + '');

    if (searchInput.sortModel) {
      searchParams.append('orderby', searchInput.sortModel.field);
      searchParams.append('asc', searchInput.sortModel.sort);
    }

    return url + searchParams;
  }

  private seriesSearchURLBuilder(searchInput: SearchInput): string {
    const url = 'https://www.mangaupdates.com/series.html?';
    const searchParams = new URLSearchParams();

    searchParams.append('search', searchInput.search);
    searchParams.append('page', searchInput.page + '');
    if (searchInput.sortModel) {
      searchParams.append('orderby', searchInput.sortModel.field);
    }

    return url + searchParams;
  }

  private seriesSearchBodyBuilder(searchInput: SearchInput): URLSearchParams {
    const params = new URLSearchParams();
    params.append('perpage', searchInput.perPage + '');
    return params;
  }

  private getTextInBrackets(string: string): string {
    const pages = string.match(/\(([^)]+)\)/);
    if (!pages) {
      return '1';
    }
    return pages[1];
  }
}
