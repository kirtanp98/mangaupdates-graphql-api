import { Page } from 'puppeteer';

export interface Parser<Type> {
  parse: (page: Page) => Promise<void>;
  getObject: () => Type;
}
