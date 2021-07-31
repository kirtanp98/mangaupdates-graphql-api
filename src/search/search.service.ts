import { Injectable } from '@nestjs/common';
import { URLSearchParams } from 'url';
import {
  Search,
  SearchInput,
  SeriesSearchItem,
} from './entities/search.entity';
import { ItemsPerPage, ResultType } from './entities/search.enum';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { SeriesGenre } from 'src/series/entities/type.enum';
import SharedFunctions from 'src/shared/SharedMethods';

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

    const result: SeriesSearchItem[] = [];

    const series = $('.col-12.col-lg-6.p-3.text');

    series.each((i, elem) => {
      const parsedSeries = new SeriesSearchItem();

      parsedSeries.id = SharedFunctions.getIdfromURL(
        $(elem).find('.h-100.w-100').attr('href'),
      );

      parsedSeries.image = $(elem).find('.h-100.w-100>img').attr('src');

      parsedSeries.nsfw = parsedSeries.image ? false : true;

      parsedSeries.title = $(elem).find('u>b').text();

      parsedSeries.description = $(elem).find('.text.flex-grow-1').text();

      parsedSeries.genres = this.parsedGenres(
        $(elem).find('.textsmall>a').attr('title'),
      );

      const [year, score] = this.parseYearAndScore(
        $(elem).find('.text').last().text(),
      );

      parsedSeries.year = year;
      parsedSeries.average = score;

      result.push(parsedSeries);
    });

    return [result, totalPages];
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

  private parsedGenres(genres: string): SeriesGenre[] {
    if (genres.length === 0) {
      return [];
    }
    const splitGenres = genres.split(', ');
    return splitGenres.map((item) => <SeriesGenre>item);
  }

  private parseYearAndScore(text: string): [number?, number?] {
    text = text.replace(/\s+/g, '');

    if (text.includes('-')) {
      // Year and score
      const split = text.split('-');
      const year = Number(split[0]);
      const score = Number(split[1].split('/')[0]);

      return [year, score];
    } else {
      if (text.includes('/')) {
        // only score
        return [null, Number(text.split('/')[0])];
      } else {
        // only year
        return [Number(text), null];
      }
    }

    return [null, null];
  }

  private getTextInBrackets(string: string): string {
    return string.match(/\(([^)]+)\)/)[1];
  }
}
