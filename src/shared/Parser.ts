import { CheerioAPI } from 'cheerio';
import { Page } from 'puppeteer';

export interface Parser<Type> {
  parse: (page: Page | CheerioAPI) => Promise<void>;
  getObject: () => Type;
}
