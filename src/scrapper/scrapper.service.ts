import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import { Manga } from 'src/manga/entities/manga.entity';
import MangaUpdatesEndpoint from 'src/shared/MangaUpdates';
import { MangaParser } from 'src/parser/MangaParser';

@Injectable()
export class ScrapperService implements OnModuleInit, OnModuleDestroy {
  browser: Browser;

  async onModuleInit() {
    this.browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  }
  async onModuleDestroy() {
    await this.browser.close();
  }

  async getManga(id: number): Promise<Manga | null> {
    if (id < 1) {
      throw new Error('Invalid Id');
    }

    const page = await this.browser.newPage();

    await this.disableResources(page);
    // await this.debugMode(page);

    await page.goto(MangaUpdatesEndpoint.manga + id, {
      waitUntil: 'load',
    });

    try {
      await page.click('u > b');
      await page.click('#cat_opts > a > u');

      await page.waitForNavigation({ timeout: 500 });
    } catch (e) {
      console.error(e);
    }

    const mangaParser = new MangaParser();
    mangaParser.setId(id);
    await mangaParser.parse(page);

    return mangaParser.getObject();
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
}
