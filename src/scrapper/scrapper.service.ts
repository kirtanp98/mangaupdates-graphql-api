import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import { Manga, MangaRelation } from 'src/manga/entities/manga.entity';
import { MangaType, RelatedType } from 'src/manga/entities/type.enum';
import MangaUpdatesEndpoint from 'src/shared/MangaUpdates';

@Injectable()
export class ScrapperService implements OnModuleInit, OnModuleDestroy {
  browser: Browser;

  async onModuleInit() {
    this.browser = await puppeteer.launch();
  }
  async onModuleDestroy() {
    await this.browser.close();
  }

  async getManga(id: number): Promise<Manga | null> {
    const parenthsisReg = /\(([^)]+)\)/;

    const manga = new Manga();

    const page = await this.browser.newPage();

    await this.disableResources(page);
    // await this.debugMode(page);

    await page.goto(MangaUpdatesEndpoint.manga + id, {
      waitUntil: 'load',
    });

    // const value = await page.$eval(
    //   '.sContent',
    //   (el: HTMLElement) => el.innerText,
    // );
    manga.id = id;

    try {
      await page.click('u > b');
    } catch (e) {
      console.error(e);
    }

    let data;
    try {
      data = await page.evaluate(() => {
        // releasestitle tabletitle

        //title
        const title = (
          document.querySelector('.releasestitle.tabletitle') as HTMLElement
        ).innerText;

        //All the contntet
        const content = Array.from(
          document.querySelectorAll('.sContent'),
        ) as HTMLElement[];
        const test = content.map((element) => element.innerText);

        //related manga

        const mangaRelations = [];

        // content[2].innerText.split('\\n').map((v) => v.split(' ('));
        const mangaR = content[2].innerText
          .split('\n')
          .map((v) => v.split(' ('))
          .map((t) => {
            const type = t[t.length-1]; //.slice(0, -1);
            return { name: t[0], type: type };
          });

        const ids = [...content[2].querySelectorAll('a')].map(
          (node) => node.href,
        );

        for (let x = 0; x < ids.length; x++) {
          mangaRelations.push({
            name: mangaR[x].name,
            type: mangaR[x].type,
            id: ids[x],
          });
        }

        //associatedNames of the manga
        const associatedName = content[3].innerText.split('\n');
        associatedName.pop();

        return {
          title: title,
          description: content[0].innerText,
          type: content[1].innerText,
          names: associatedName,
          content: test,
          relations: mangaRelations,
        };
      });
    } catch (e) {
      console.error(e);
    }

    console.log(data);

    if (!data) {
      page.close();
      return;
    }

    manga.title = data.title;
    manga.description = data.description;
    manga.type = <MangaType>data.type; //bad code
    manga.associatedName = data.names;
    manga.related = data.relations.map(value => {
      const r = new MangaRelation();
      r.name = value.name;
      r.id = this.getIdfromURL(value.id);
      r.type = <RelatedType>value.type.slice(0, -1);
      return r;
    });

    page.close();
    return manga;
  }

  private async disableResources(page: puppeteer.Page): Promise<void> {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (
        ['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  private async debugMode(page: puppeteer.Page): Promise<void> {
    page.on('console', (consoleObj) => console.log(consoleObj.text()));
  }

  private getIdfromURL(url: string): number {
    return Number.parseInt(url.split('=')[1]);
  }
}
