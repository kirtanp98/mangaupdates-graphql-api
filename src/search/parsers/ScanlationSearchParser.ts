import { CheerioAPI } from 'cheerio';
import { Parser } from 'src/shared/Parser';
import SharedFunctions from 'src/shared/SharedMethods';
import { Contact, ScanlatorSearchItem } from '../entities/search.entity';

export class ScanlationSearchParser implements Parser<ScanlatorSearchItem[]> {
  searchItems: ScanlatorSearchItem[] = [];

  public async parse($: CheerioAPI): Promise<void> {
    const groups = [...$('.col-sm-5.col-9.text').map((i, el) => $(el).text())];
    const id = [
      ...$('.col-sm-5.col-9.text > a').map((i, el) =>
        SharedFunctions.getIdfromURL($(el).attr('href')),
      ),
    ];

    const active = [
      ...$('.col-sm-2.col-3.text.text-right.text-sm-center').map((i, el) => {
        return SharedFunctions.yesOrNo($(el).text());
      }),
    ];

    const sites: Contact[][] = [];

    $('.col-sm-5.d-none.d-sm-block.text').each((i, el) => {
      const groupSite: Contact[] = [];
      $(el)
        .find('a')
        .each((j, e) => {
          const contact = new Contact();
          contact.name = $(e).text();
          const link = $(e).attr('href');
          if (link) {
            contact.link = link;
          } else {
            contact.link = $(e).attr('title');
          }

          groupSite.push(contact);
        });

      sites.push(groupSite);
    });

    const scanlators: ScanlatorSearchItem[] = [];

    for (let x = 0; x < groups.length; x += 1) {
      const scanlator = new ScanlatorSearchItem();
      scanlator.id = id[x];
      scanlator.name = groups[x];
      scanlator.active = active[x];
      scanlator.contacts = sites[x];

      scanlators.push(scanlator);
    }
    this.searchItems = scanlators;
  }

  public getObject() {
    return this.searchItems;
  }
}
