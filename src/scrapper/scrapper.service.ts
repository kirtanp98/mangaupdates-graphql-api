import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import {
  Category,
  ForumStats,
  GroupData,
  Manga,
  MangaRatings,
  MangaRelation,
} from 'src/manga/entities/manga.entity';
import {
  MangaGenre,
  MangaStatus,
  MangaType,
  RelatedType,
} from 'src/manga/entities/type.enum';
import MangaUpdatesEndpoint from 'src/shared/MangaUpdates';
import { parse } from 'date-fns';

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

    manga.id = id;

    try {
      await page.click('u > b');
      await page.click('#cat_opts > a > u');
      // await Promise.all([page.click('u > b'), page.click('#cat_opts > a > u')]);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    } catch (e) {
      console.error(e);
    }

    let data;
    try {
      data = await page.evaluate(() => {
        // releasestitle tabletitle
        document.querySelectorAll('u > b').forEach((v: HTMLElement) => {
          if (v.innerText == 'M') {
            v.click();
          }
        });
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
            const type = t[t.length - 1]; //.slice(0, -1);
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

        //img of the manga
        const image = document.querySelector('.sContent > center > img');
        const imgUrl: string | null =
          image != null ? (image as HTMLImageElement).src : null;

        //groups
        const groupdoms = [...content[4].querySelectorAll('a')];
        const groupName = groupdoms.map(
          (element: HTMLElement) => element.innerText,
        );
        groupName.pop();

        const groupId = groupdoms.map((element) => {
          return element.href;
        });

        groupId.pop();

        // latest releases
        const releases = content[5].innerText.split('\n');
        releases.pop();

        // status
        const status = content[6].innerText;

        //scanlated
        const scanned = content[7].innerText;

        //anime chapter
        const animeChapter = content[8].innerText;

        //review ids
        const reviews = [...content[9].querySelectorAll('a')].map(
          (node) => node.href,
        );
        reviews.pop();

        //Forum stats
        const stats = content[10].innerText;

        //ratings
        const ratings = content[11].innerText;

        //Last updates
        const updated = content[12].innerText;

        //generes
        const genres = [
          ...[...content[14].querySelectorAll('a')].map((node) =>
            node.querySelector('u'),
          ),
        ].map((link) => link.innerText);
        genres.pop();

        //categories
        const categories = [...content[15].querySelectorAll('li > a')].map(
          (v: HTMLElement) => {
            return { score: v.title, name: v.innerText };
          },
        ); //innerText and title

        categories.shift();

        //category recommendations
        const catRecommendations = [...content[16].querySelectorAll('a')].map(
          (v) => {
            return { title: v.innerText, id: v.href };
          },
        );

        //normal recommendations
        const recs = [...content[17].querySelectorAll('a')].map((v) => {
          return { title: v.innerText, id: v.href };
        });
        if (recs.length > 5) {
          recs.splice(5, 1);
        }
        recs.pop();

        //authors
        const author = content[18].innerText;

        //artist
        const artist = content[19].innerText;

        //year
        const year = content[20].innerText;

        //publishers
        const publishers = content[21].innerText;

        //serialization
        const serialize = content[22].innerText;

        //licensed
        const licensed = content[23].innerText;

        //english publishers
        const english = content[24].innerText;

        return {
          title: title,
          description: content[0].innerText,
          type: content[1].innerText,
          names: associatedName,
          content: test,
          relations: mangaRelations,
          img: imgUrl,
          groupName: groupName,
          groupid: groupId,
          releases: releases,
          status: status,
          scanned: scanned,
          animeChapter: animeChapter,
          reviews: reviews,
          stats: stats,
          ratings: ratings,
          updated: updated,
          genres: genres,
          categories: categories,
          caregoryRec: catRecommendations,
          recs: recs,
          author: author,
          artist: artist,
          year: year,
          publishers: publishers,
          serialize: serialize,
          licensed: licensed,
          english: english,
        };
      });
    } catch (e) {
      console.error(e);
    }

    if (!data) {
      page.close();
      return;
    }

    manga.title = data.title;
    manga.description = data.description;
    manga.image = data.img;
    manga.type = <MangaType>data.type; //bad code
    manga.associatedName = data.names;
    manga.related = data.relations.map((value) => {
      const r = new MangaRelation();
      r.name = value.name;
      r.id = this.getIdfromURL(value.id);
      r.type = <RelatedType>value.type.slice(0, -1);
      return r;
    });

    const groups: GroupData[] = [];
    for (let x = 0; x < data.groupName.length; x++) {
      const g = new GroupData();
      g.name = data.groupName[x];
      if (this.doesUrlHaveId(data.groupid[x])) {
        g.id = this.getIdfromURL(data.groupid[x]);
      } else {
        g.id = null;
      }
      groups.push(g);
    }

    manga.groups = groups;
    manga.releases = data.releases;
    manga.status = this.stringToStatus(data.status);
    manga.fullyScanlated = this.yesOrNo(data.scanned);
    manga.animeChapters = data.animeChapter;
    manga.userReviews = data.reviews.map((r) => this.getIdfromURL(r));

    const formStats = new ForumStats();
    const [topics, post] = this.statsFromStrgin(data.stats);
    formStats.posts = post;
    formStats.topics = topics;

    manga.forumStats = formStats;
    manga.ratings = this.reviewsFromString(data.ratings);
    manga.lastUpdated = this.parseLastUpdatedDate(data.updated);
    manga.genres = data.genres.map((value) => <MangaGenre>value);

    manga.categories = data.categories.map((cat) => {
      const category = new Category();
      category.name = cat.name;
      category.score = this.scoreFromString(cat.score);

      return category;
    });

    manga.categoriesRecommendations = data.caregoryRec.map((value) => {
      const r = new MangaRelation();
      r.name = value.title;
      r.id = this.getIdfromURL(value.id);
      return r;
    });

    manga.recommendations = data.recs.map((value) => {
      const r = new MangaRelation();
      r.name = value.title;
      r.id = this.getIdfromURL(value.id);
      return r;
    });

    const authors = data.author.split('\n');
    authors.pop();
    manga.authors = authors;

    const artist = data.artist.split('\n');
    artist.pop();
    manga.artist = artist;

    manga.year = Number(data.year);

    const publishers = data.publishers.split('\n');
    publishers.pop();
    manga.originalPublishers = publishers;

    const serialized = data.serialize.split('\n');
    serialized.pop();
    manga.serializedMagazines = serialized;

    manga.licensed = this.yesOrNo(data.licensed);

    if (data.english !== 'N/A') {
      const english = data.english.split('\n');
      english.pop();
      manga.englishPublishers = english;
    }

    page.close();

    manga.cached = new Date();

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

  private doesUrlHaveId(url: string): boolean {
    return url.includes('id');
  }

  private stringToStatus(status: string): MangaStatus {
    if (status.includes('Ongoing')) {
      return MangaStatus.Ongoing;
    }

    if (status.includes('Hiatus')) {
      return MangaStatus.Hiatus;
    }

    if (status.includes('Complete')) {
      return MangaStatus.Complete;
    }

    return MangaStatus.Unknown;
  }

  private yesOrNo(s: string): boolean {
    if (s === 'No') {
      return false;
    }
    return true;
  }

  private statsFromStrgin(s: string): [number, number] {
    const regex = /\d+/g;
    const result = [...s.matchAll(regex)];
    return [Number(result[0][0]), Number(result[1][0])];
  }

  private scoreFromString(s: string): number {
    const regex = /\d+/g;
    const result = [...s.matchAll(regex)];
    return Number(result[0][0]);
  }

  private reviewsFromString(s: string): MangaRatings {
    const ratings = new MangaRatings();
    const regex = /\d+/g;
    const result = [...s.matchAll(regex)];

    ratings.average = Number(result[0]);
    ratings.votes = Number(result[3]);
    ratings.bayesianAverage = Number(result[4] + '.' + result[5]);

    //8 +9

    const total: number[] = [];

    for (let x = 9; x < result.length; x += 2) {
      total.push(Number(result[x])); // from 10 to 0;
    }

    ratings.distribution = total;

    return ratings;
  }

  private parseLastUpdatedDate(s: string): Date {
    const timeOfDay = s.substring(s.length - 6, s.length - 4).toUpperCase();
    s = s.substring(0, s.length - 6);
    s += timeOfDay + ' -08:00';

    return parse(s, 'MMMM do yyyy, h:mmbb xxxxx', new Date());
    // fix this later, not parsing correctly
  }
}
