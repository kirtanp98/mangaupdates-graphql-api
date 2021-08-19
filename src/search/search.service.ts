import { Injectable } from '@nestjs/common';
import { URLSearchParams } from 'url';
import {
  AuthorSearchItem,
  PublisherSearchItem,
  ReleaseSearchItem,
  ScanlatorSearchItem,
  Search,
  SearchInput,
  SearchResultUnion,
  SeriesSearchItem,
} from './entities/search.entity';
import { ItemsPerPage, ResultType } from './entities/search.enum';
import fetch from 'node-fetch';
import cheerio, { CheerioAPI } from 'cheerio';
import { SeriesSearchParser } from './parsers/SeriesSearchParser';
import { ReleaseSearchParser } from './parsers/ReleaseSearchParser';
import { ScanlationSearchParser } from './parsers/ScanlationSearchParser';
import { PublisherSearchParser } from './parsers/PublisherSearchParser';
import { AuthorSearchParser } from './parsers/AuthorSearchParser';

@Injectable()
export class SearchService {
  // This needs to get refactored and all fo the code in this service too
  async orchestrateSearch(searchInput: SearchInput): Promise<Search> {
    const searchResult = new Search();
    searchResult.page = searchInput.page ?? ItemsPerPage.TwentyFive;
    searchResult.perPage = searchInput.perPage ?? 1;

    let items: Array<typeof SearchResultUnion>, pages: number;

    switch (searchInput.resultTypes) {
      case ResultType.Authors:
        [items, pages] = await this.authorSearch(searchInput);
        break;
      case ResultType.Publishers:
        [items, pages] = await this.publisherSearch(searchInput);
        break;
      case ResultType.Releases:
        [items, pages] = await this.releasesSearch(searchInput);
        break;
      case ResultType.Scanlators:
        [items, pages] = await this.scanlatorsSearch(searchInput);
        break;
      case ResultType.Series:
        [items, pages] = await this.seriesSearch(searchInput);
        break;
      default:
        break;
    }

    searchResult.items = items;
    searchResult.totalPages = pages;
    return searchResult;
  }

  async authorSearch(
    searchInput: SearchInput,
  ): Promise<[AuthorSearchItem[], number]> {
    const url = this.authorSearchURLBuilder(searchInput);

    const data = await fetch(url, {
      method: 'GET',
    });
    const html = await data.text();
    const $ = cheerio.load(html);

    const totalPages = this.getPageNumbers($, searchInput);

    const authorParser = new AuthorSearchParser();
    await authorParser.parse($);

    const result = authorParser.getObject();

    return [result, totalPages];
  }

  async publisherSearch(
    searchInput: SearchInput,
  ): Promise<[PublisherSearchItem[], number]> {
    const url = this.publisherSearchURLBuilder(searchInput);

    const data = await fetch(url, {
      method: 'GET',
    });
    const html = await data.text();
    const $ = cheerio.load(html);

    const totalPages = this.getPageNumbers($, searchInput);

    const publisherParser = new PublisherSearchParser();
    await publisherParser.parse($);

    const result = publisherParser.getObject();

    return [result, totalPages];
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

    const totalPages = this.getPageNumbers($, searchInput);

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

    const totalPages = this.getPageNumbers($, searchInput);

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

    const totalPages = this.getPageNumbers($, searchInput);

    const searchParser = new SeriesSearchParser();
    await searchParser.parse($);
    const result = searchParser.getObject();

    return [result, totalPages];
  }

  getPageNumbers($: CheerioAPI, searchInput: SearchInput) {
    const totalPages = Number(
      this.getTextInBrackets($('.d-none.d-md-inline-block').text()),
    );

    if (totalPages < searchInput.page) {
      throw new Error('Page out of limit');
    }

    return totalPages;
  }

  private authorSearchURLBuilder(searchInput: SearchInput): string {
    const url = 'https://www.mangaupdates.com/authors.html?';
    const searchParams = new URLSearchParams();

    searchParams.append('page', searchInput.page + '');
    searchParams.append('search', searchInput.search);
    searchParams.append('perpage', searchInput.perPage + '');

    if (searchInput.sortModel) {
      searchParams.append('orderby', searchInput.sortModel.field);
      searchParams.append('asc', searchInput.sortModel.sort);
    }

    return url + searchParams;
  }

  private publisherSearchURLBuilder(searchInput: SearchInput): string {
    const url = 'https://www.mangaupdates.com/publishers.html?';
    const searchParams = new URLSearchParams();

    searchParams.append('page', searchInput.page + '');
    searchParams.append('search', searchInput.search);
    searchParams.append('perpage', searchInput.perPage + '');

    if (searchInput.sortModel) {
      searchParams.append('orderby', searchInput.sortModel.field);
      searchParams.append('asc', searchInput.sortModel.sort);
    }

    return url + searchParams;
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
