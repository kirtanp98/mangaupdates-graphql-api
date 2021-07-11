import { parse } from 'date-fns';
import { Page } from 'puppeteer';
import {
  ActivityStat,
  Category,
  ForumStats,
  GroupData,
  ListStat,
  Series,
  SeriesRatings,
  SeriesRelation,
} from 'src/series/entities/series.entity';
import {
  SeriesGenre,
  SeriesStatus,
  SeriesType,
  Period,
  RelatedType,
} from 'src/series/entities/type.enum';
import { Parser } from 'src/shared/Parser';

export class SeriesParser implements Parser<Series> {
  series: Series = new Series();

  public setId(id: number): void {
    this.series.id = id;
  }

  public async parse(page: Page): Promise<void> {
    let data;
    let error: Error;

    try {
      data = await page.evaluate(() => {
        document.querySelectorAll('u > b').forEach((v: HTMLElement) => {
          if (v.innerText == 'M') {
            v.click();
          }
        });
        //title
        const title = (
          document.querySelector('.releasestitle.tabletitle') as HTMLElement
        ).innerText;

        //get all the content
        const content = Array.from(
          document.querySelectorAll('.sContent'),
        ) as HTMLElement[];

        //related series
        const seriesRelations = [];

        const seriesRelationParsed = content[2].innerText
          .split('\n')
          .map((v) => v.split(' ('))
          .map((t) => {
            const type = t[t.length - 1];
            return { name: t[0], type: type };
          });

        const ids = [...content[2].querySelectorAll('a')].map(
          (node) => node.href,
        );

        for (let x = 0; x < ids.length; x++) {
          seriesRelations.push({
            name: seriesRelationParsed[x].name,
            type: seriesRelationParsed[x].type,
            id: ids[x],
          });
        }

        //associatedNames of the series
        const associatedName = content[3].innerText.split('\n');
        associatedName.pop();

        //img of the series
        const image = document.querySelector('.sContent > center > img');
        const imgUrl: string | null =
          image != null ? (image as HTMLImageElement).src : null;

        //groups
        const groupdoms = [...content[4].querySelectorAll('a')];
        const groupName = groupdoms.map(
          (element: HTMLElement) => element.innerText,
        );

        const groupId = groupdoms.map((element) => {
          return element.href;
        });

        if (groupName[groupName.length - 1] === 'Less...') {
          groupName.pop();
          groupId.pop();
        }

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
        );

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

        //activity stats
        const activity = content[25].innerText;

        //list stats
        const listStats = content[26].innerText;

        return {
          title: title,
          description: content[0].innerText,
          type: content[1].innerText,
          names: associatedName,
          relations: seriesRelations,
          img: imgUrl,
          groupName: groupName,
          groupId: groupId,
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
          categoryRec: catRecommendations,
          recs: recs,
          author: author,
          artist: artist,
          year: year,
          publishers: publishers,
          serialize: serialize,
          licensed: licensed,
          english: english,
          activityStats: activity,
          listStats: listStats,
        };
      });
    } catch (e) {
      error = e as Error;
      console.error(e);
    }

    if (!data && error) {
      page.close();
      throw new Error('Could not fetch series data');
    }

    this.series.title = data.title;
    this.series.description = data.description.replace(' Less...', '');
    this.series.image = data.img;
    this.series.type = <SeriesType>data.type; //bad code
    this.series.associatedName = data.names;
    this.series.related = data.relations.map((value) => {
      const r = new SeriesRelation();
      r.name = value.name;
      r.id = this.getIdfromURL(value.id);
      r.type = <RelatedType>value.type.slice(0, -1);
      return r;
    });

    const groups: GroupData[] = [];
    for (let x = 0; x < data.groupName.length; x++) {
      const g = new GroupData();
      g.name = data.groupName[x];
      if (this.doesUrlHaveId(data.groupId[x])) {
        g.id = this.getIdfromURL(data.groupId[x]);
      } else {
        g.id = null;
      }
      groups.push(g);
    }

    this.series.groups = groups;
    this.series.releases = data.releases;
    this.series.status = this.stringToStatus(data.status);
    this.series.fullyScanlated = this.yesOrNo(data.scanned);
    this.series.animeChapters = data.animeChapter;
    this.series.userReviews = data.reviews.map((r) => this.getIdfromURL(r));

    const formStats = new ForumStats();
    const [topics, post] = this.statsFromStrgin(data.stats);
    formStats.posts = post;
    formStats.topics = topics;

    this.series.forumStats = formStats;
    this.series.ratings = this.reviewsFromString(data.ratings);
    this.series.lastUpdated = this.parseLastUpdatedDate(data.updated);
    this.series.genres = data.genres.map((value) => <SeriesGenre>value);

    this.series.categories = data.categories.map((cat) => {
      const category = new Category();
      category.name = cat.name;
      category.score = this.scoreFromString(cat.score);

      return category;
    });

    this.series.categoriesRecommendations = data.categoryRec.map((value) => {
      const r = new SeriesRelation();
      r.name = value.title;
      r.id = this.getIdfromURL(value.id);
      return r;
    });

    this.series.recommendations = data.recs.map((value) => {
      const r = new SeriesRelation();
      r.name = value.title;
      r.id = this.getIdfromURL(value.id);
      return r;
    });

    const authors = data.author.split('\n');
    authors.pop();
    this.series.authors = authors;

    const artist = data.artist.split('\n');
    artist.pop();
    this.series.artist = artist;

    this.series.year = Number(data.year);

    const publishers = data.publishers.split('\n');
    publishers.pop();
    this.series.originalPublishers = publishers;

    const serialized = data.serialize.split('\n');
    serialized.pop();
    this.series.serializedMagazines = serialized;

    this.series.licensed = this.yesOrNo(data.licensed);

    if (data.english !== 'N/A') {
      const english = data.english.split('\n');
      english.pop();
      this.series.englishPublishers = english;
    }

    this.series.activityStats = this.activityStatsFromString(
      data.activityStats,
    );
    this.series.listStats = this.listStatsFromString(data.listStats);

    page.close();

    this.series.cached = new Date();
  }

  public getObject(): Series {
    return this.series;
  }

  private doesUrlHaveId(url: string): boolean {
    return url.includes('id');
  }

  private stringToStatus(status: string): SeriesStatus {
    if (status.includes('Ongoing')) {
      return SeriesStatus.Ongoing;
    }

    if (status.includes('Hiatus')) {
      return SeriesStatus.Hiatus;
    }

    if (status.includes('Complete')) {
      return SeriesStatus.Complete;
    }

    return SeriesStatus.Unknown;
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

  private reviewsFromString(s: string): SeriesRatings {
    const ratings = new SeriesRatings();
    const regex = /\d+/g;
    const result = [...s.matchAll(regex)];

    ratings.average = Number(result[0]);
    ratings.votes = Number(result[3]);
    ratings.bayesianAverage = Number(result[4] + '.' + result[5]);

    const total: number[] = [];

    for (let x = 9; x < result.length; x += 2) {
      total.push(Number(result[x])); // from 10 to 0;
    }

    ratings.distribution = total;

    return ratings;
  }

  private activityStatsFromString(s: string): ActivityStat[] {
    const stats: ActivityStat[] = [];

    const statsString = s.split('\n');
    statsString.pop();

    const formatted = statsString.map((s) => {
      const str = s.split('#');
      return {
        period: str[0],
        pos: str[1].replace('(', '').replace(')', ''),
      };
    });

    formatted.forEach((value) => {
      const arr = value.pos.split(/(\s+)/); //wack issue where the white space isn't a space
      const stat = new ActivityStat();
      stat.dateRange = this.stringToPeriod(value.period.split(' ')[0]);
      stat.position = Number(arr[0]);
      stat.change = 0;
      if (arr.length > 2) {
        const num = Number(arr[2].replace('+', ''));
        if (!Number.isNaN(num)) {
          stat.change = Number(num);
        }
      }

      stats.push(stat);
    });

    return stats;
  }

  private listStatsFromString(s: string): ListStat[] {
    const lists: ListStat[] = [];

    const listStrings = s.split('\n');
    listStrings.pop();

    listStrings.forEach((value) => {
      const listA = value.split(' ');
      const stat = new ListStat();
      stat.amount = Number(listA[1]);
      stat.list = listA[2];
      lists.push(stat);
    });

    return lists;
  }

  private parseLastUpdatedDate(s: string): Date {
    const timeOfDay = s.substring(s.length - 6, s.length - 4).toUpperCase();
    s = s.substring(0, s.length - 6);
    s += timeOfDay + ' -08:00';

    return parse(s, 'MMMM do yyyy, h:mmbb xxxxx', new Date());
    // fix this later, not parsing correctly
  }

  private stringToPeriod(s: string): Period {
    switch (s) {
      case 'Weekly':
        return Period.Weekly;
      case 'Monthly':
        return Period.Monthly;
      case '3':
        return Period.ThreeMonths;
      case '6':
        return Period.SixMonths;
      case 'Year':
        return Period.Year;
      default:
        return Period.Year;
    }
  }

  private getIdfromURL(url: string): number {
    return Number.parseInt(url.split('=')[1]);
  }
}
