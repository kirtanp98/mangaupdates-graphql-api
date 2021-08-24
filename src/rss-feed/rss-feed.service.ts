import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { parse } from 'date-fns';
import { PubSubEngine } from 'graphql-subscriptions';
import * as Parser from 'rss-parser';
import SharedFunctions from 'src/shared/SharedMethods';
import { RssFeedItem } from './entities/rss-feed.entity';

@Injectable()
export class RssFeedService {
  set = new Set<string>();
  parser = new Parser();

  constructor(@Inject('PUB_SUB') private pubSub: PubSubEngine) {}

  @Cron('30 * * * * *')
  async gettingNewReleases() {
    const releases = await this.parser.parseURL(
      'https://www.mangaupdates.com/rss.php',
    );

    releases.items.forEach((r) => {
      if (!this.set.has(r.title)) {
        if (r.title === 'Baka Updates Manga') {
          return;
        }

        const item = new RssFeedItem();
        item.title = r.title;
        item.id = SharedFunctions.getIdfromURL(r.link);
        item.group = this.getGroupFromTitle(r.title);
        item.content = r.content;
        item.date = r.content ? this.getDate(r.content) : new Date();

        this.pubSub.publish('rssFeed', { rssFeed: item });
      }
    });

    this.set = new Set();

    releases.items.forEach((r) => {
      this.set.add(r.title);
    });
  }

  private getGroupFromTitle(s: string) {
    if (!s) {
      return null;
    }

    const ending = s.indexOf(']');
    if (ending < 0) {
      return null;
    }

    return s.substring(1, ending);
  }

  private getDate(s: string) {
    if (s == null) {
      return new Date();
    }

    const contentArray = s.split('<br />');
    return parse(contentArray[0], 'yyyy-MM-dd', new Date());
  }
}
