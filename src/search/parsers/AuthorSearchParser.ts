import { CheerioAPI } from 'cheerio';
import { Parser } from 'src/shared/Parser';
import SharedFunctions from 'src/shared/SharedMethods';
import { AuthorSearchItem } from '../entities/search.entity';

export class AuthorSearchParser implements Parser<AuthorSearchItem[]> {
  searchItems: AuthorSearchItem[] = [];

  public async parse($: CheerioAPI): Promise<void> {
    // const publisherIdAndName = [
    //   ...$('.col-sm-6.p-1.p-md-0.col-8.text > a').map((i, e) => {
    //     return {
    //       name: $(e).text(),
    //       id: SharedFunctions.getIdfromURL($(e).attr('href')),
    //     };
    //   }),
    // ];
    // const publishers = publisherIdAndName.map((value) => value.name);
    // const id = publisherIdAndName.map((value) => value.id);
    // const otherInfo = [...$('.col-sm-2.p-1.p-md-0').map((i, e) => $(e).text())];
    // const types = otherInfo.filter((v, i) => i % 3 === 0);
    // const publications = otherInfo
    //   .filter((v, i) => i % 3 === 1)
    //   .map((v) => (v !== '--' ? Number(v) : null));
    // const series = otherInfo
    //   .filter((v, i) => i % 3 === 2)
    //   .map((v) => (v !== '--' ? Number(v) : null));
    // for (let x = 0; x < publishers.length; x += 1) {
    //   const publisher = new PublisherSearchItem();
    //   publisher.id = id[x];
    //   publisher.publisher = publishers[x];
    //   publisher.type = types[x] !== '--' ? types[x] : null;
    //   publisher.publications = publications[x];
    //   publisher.series = series[x];
    //   this.searchItems.push(publisher);
    // }

    //.col-md-4.col-7.p-1.p-md-0.text > a
  }

  public getObject() {
    return this.searchItems;
  }
}
