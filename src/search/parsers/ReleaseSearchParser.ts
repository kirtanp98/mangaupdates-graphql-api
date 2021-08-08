import { CheerioAPI } from 'cheerio';
import { parse } from 'date-fns';
import { Parser } from 'src/shared/Parser';
import SharedFunctions from 'src/shared/SharedMethods';
import { Group, ReleaseSearchItem, Title } from '../entities/search.entity';

export class ReleaseSearchParser implements Parser<ReleaseSearchItem[]> {
  searchItems: ReleaseSearchItem[] = [];

  public async parse($: CheerioAPI): Promise<void> {
    const dates = $('.row.no-gutters > .col-2.text')
      .toArray()
      .map((element, i) => {
        return $(element).text();
      });

    const titlesAndGroups = $('.row.no-gutters > .col-4.text');

    const titles = titlesAndGroups.filter((i, element) => i % 2 === 0);
    const groups = titlesAndGroups.filter((i, element) => i % 2 === 1);

    const volumeAndChapter = $('.col-1.text.text-center');

    const volumes = volumeAndChapter.filter((i, element) => i % 2 === 0);
    const chapters = volumeAndChapter.filter((i, element) => i % 2 === 1);

    for (let x = 0; x < dates.length; x += 1) {
      const release = new ReleaseSearchItem();
      release.date = this.stringToDate(dates[x]);
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

      this.searchItems.push(release);
    }
  }

  public getObject() {
    return this.searchItems;
  }

  private stringToDate(s: string): Date {
    return parse(s, 'MM/dd/yy', new Date());
  }
}
