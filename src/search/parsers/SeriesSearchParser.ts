import { CheerioAPI } from 'cheerio';
import { SeriesGenre } from 'src/series/entities/type.enum';
import { Parser } from 'src/shared/Parser';
import SharedFunctions from 'src/shared/SharedMethods';
import { SeriesSearchItem } from '../entities/search.entity';

export class SeriesSearchParser implements Parser<SeriesSearchItem[]> {
  searchItems: SeriesSearchItem[] = [];

  public async parse($: CheerioAPI): Promise<void> {
    const series = $('.col-12.col-lg-6.p-3.text');

    series.each((i, elem) => {
      const parsedSeries = new SeriesSearchItem();

      parsedSeries.id = SharedFunctions.getIdfromURL(
        $(elem).find('.h-100.w-100').attr('href'),
      );

      parsedSeries.image = $(elem).find('.h-100.w-100>img').attr('src');

      parsedSeries.nsfw = parsedSeries.image ? false : true;

      parsedSeries.name = $(elem).find('u>b').text();

      parsedSeries.description = $(elem).find('.text.flex-grow-1').text();

      parsedSeries.genres = this.parsedGenres(
        $(elem).find('.textsmall>a').attr('title'),
      );

      const [year, score] = this.parseYearAndScore(
        $(elem).find('.text').last().text(),
      );

      parsedSeries.year = year;
      parsedSeries.average = score;

      this.searchItems.push(parsedSeries);
    });
  }

  public getObject() {
    return this.searchItems;
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
}
