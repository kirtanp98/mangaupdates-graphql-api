import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import { Manga } from 'src/manga/entities/manga.entity';
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

  async getManga(id: number): Promise<Manga> {
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
      console.log(e);
    }

    const data = await page.evaluate(() => {
      // releasestitle tabletitle
      return (document.querySelector('.sContent') as HTMLElement).innerText;
    });

    manga.description = data;

    page.close();
    return manga;
  }
}
