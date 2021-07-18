import { Injectable } from '@nestjs/common';
import { parseISO } from 'date-fns';
import { CacheService } from 'src/cache/cache.service';
import { ScraperService } from 'src/scraper/scraper.service';
import { Types } from 'src/shared/ObjectType';
import { Series } from './entities/series.entity';

@Injectable()
export class SeriesService {
  constructor(
    private readonly scraper: ScraperService,
    private readonly cache: CacheService,
  ) {}

  async getSeries(id: number) {
    try {
      const json = await this.cache.getCache(id, Types.Series);
      return this.jsonToSeries(json);
    } catch (error) {}

    const series = await this.scraper.getSeries(id);
    this.cache.setCache(id, Types.Series, JSON.stringify(series));

    return series;
  }

  private jsonToSeries(json: string): Series {
    const obj = JSON.parse(json);
    obj.cached = parseISO(obj.cached);
    obj.lastUpdated = parseISO(obj.lastUpdated);

    return obj as Series;
  }
}
