import { CheerioAPI } from 'cheerio';
import { SeriesGenre } from 'src/series/entities/type.enum';
import { Parser } from 'src/shared/Parser';
import SharedFunctions from 'src/shared/SharedMethods';
import { AuthorSearchItem } from '../entities/search.entity';

export class AuthorSearchParser implements Parser<AuthorSearchItem[]> {
  searchItems: AuthorSearchItem[] = [];

  public async parse($: CheerioAPI): Promise<void> {
    const authors = [
      ...$('.col-md-4.col-7.p-1.p-md-0.text > a').map((i, e) => {
        return {
          author: $(e).text(),
          id: SharedFunctions.getIdfromURL($(e).attr('href')),
        };
      }),
    ];

    const series = [
      ...$('.col-md-2.d-none.d-sm-block.text').map((i, e) =>
        Number($(e).text()),
      ),
    ];

    const flatGenres = [
      ...$('.col-md-6.col-5.p-1.p-md-0.text-truncate').map((i, e) =>
        $(e).text(),
      ),
    ];

    const genres = flatGenres.map((v) => {
      if (v === '') {
        return null;
      }
      return v.split(', ').map((z) => <SeriesGenre>z);
    });

    for (let x = 0; x < authors.length; x += 1) {
      const authorSearchItem = new AuthorSearchItem();
      authorSearchItem.name = authors[x].author;
      authorSearchItem.id = authors[x].id;
      authorSearchItem.series = series[x];
      authorSearchItem.genres = genres[x];
      this.searchItems.push(authorSearchItem);
    }
  }

  public getObject() {
    return this.searchItems;
  }
}
