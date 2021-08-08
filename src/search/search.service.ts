import { Injectable } from '@nestjs/common';
import { URLSearchParams } from 'url';
import {
  Group,
  ReleaseSearchItem,
  Search,
  SearchInput,
  SeriesSearchItem,
  Title,
} from './entities/search.entity';
import { ItemsPerPage, ResultType } from './entities/search.enum';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { SeriesSearchParser } from './parsers/SeriesSearchParser';
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
        const [releases, pages] = await this.releasesSearch(searchInput);
        searchResult.releases = releases;
        searchResult.totalPages = pages;
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

  async releasesSearch(
    searchInput: SearchInput,
  ): Promise<[ReleaseSearchItem[], number]> {
    const url = this.releaseSearchURLBuilder(searchInput);
    const data = await fetch(url, {
      method: 'GET',
    });
    const html = await data.text();
    const $ = cheerio.load(html);

    // console.log($.text());
    const totalPages = Number(
      this.getTextInBrackets($('.d-none.d-md-inline-block').text()),
    );

    if (totalPages < searchInput.page) {
      throw new Error('Page out of limit');
    }

    const dates = $('.row.no-gutters > .col-2.text')
      .toArray()
      .map((element, i) => {
        return $(element).text();
      });
    console.log(dates);

    const titlesAndGroups = $('.row.no-gutters > .col-4.text');

    const titles = titlesAndGroups.filter((i, element) => i % 2 === 0);
    const groups = titlesAndGroups.filter((i, element) => i % 2 === 1);

    console.log(titles.length, groups.length);
    titles.each((i, el) => {
      console.log($(el).text(), 'title');
      console.log($(el).find('a').attr('href'), 'title id');
    });
    groups.each((i, el) => {
      $(el)
        .find('a')
        .each((k, element) => {
          console.log($(element).text(), $(element).attr('href'), 'group', k);
        });
    });

    const volumeAndChapter = $('.col-1.text.text-center');

    const volumes = volumeAndChapter.filter((i, element) => i % 2 === 0);
    const chapters = volumeAndChapter.filter((i, element) => i % 2 === 1);

    volumes.each((i, el) => {
      console.log($(el).text(), 'volumes');
    });

    chapters.each((i, el) => {
      console.log($(el).text(), 'chapters');
    });

    console.log(
      dates.length,
      titles.length,
      volumes.length,
      chapters.length,
      groups.length,
    );

    const result: ReleaseSearchItem[] = [];

    for (let x = 0; x < dates.length; x += 1) {
      const release = new ReleaseSearchItem();
      release.date = new Date(); //dates[0]
      release.title = new Title();
      release.title.title = $(titles[x]).text();
      release.title.id = SharedFunctions.getIdfromURL(
        $(titles[x]).find('a').attr('href'),
      );
      release.volume = $(volumes[x]).text();
      release.chapter = $(chapters[x]).text();

      release.groups = [
        ...$(groups[x])
          .find('a')
          .map((k, element) => {
            const group = new Group();
            group.id = SharedFunctions.getIdfromURL($(element).attr('href'));
            group.name = $(element).text();
            return group;
          }),
      ];

      result.push(release);
    }

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
