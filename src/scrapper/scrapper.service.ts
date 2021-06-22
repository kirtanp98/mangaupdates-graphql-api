import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import { Manga } from 'src/manga/entities/manga.entity';
import { MangaType } from 'src/manga/entities/type.enum';
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
    const manga = new Manga();

    const page = await this.browser.newPage();
    await page.goto(MangaUpdatesEndpoint.manga + id, {
      waitUntil: 'networkidle0',
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

    const data = await page.evaluate(() => {
      // releasestitle tabletitle

      const title = (
        document.querySelector('.releasestitle.tabletitle') as HTMLElement
      ).innerText;

      const content = Array.from(
        document.querySelectorAll('.sContent'),
      ) as HTMLElement[];
      const test = content.map((element) => element.innerText);

      const associatedName = content[3].innerText.split('\n');
      associatedName.pop();
      return {
        title: title,
        description: content[0].innerText,
        type: content[1].innerText,
        names: associatedName,
        content: test,
      };
    });

    manga.title = data.title;
    manga.description = data.description;
    manga.type = <MangaType>data.type; //bad code
    manga.associatedName = data.names;

    page.close();
    return manga;
  }

  private getIdfromURL(url: string): number {
    return Number.parseInt(url.split('=')[1]);
  }
}
