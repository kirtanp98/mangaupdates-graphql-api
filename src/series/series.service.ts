import { Injectable } from '@nestjs/common';
import { parseISO } from 'date-fns';
import { CacheService } from 'src/cache/cache.service';
import { ScrapperService } from 'src/scrapper/scrapper.service';
import { Series } from './entities/series.entity';

@Injectable()
export class SeriesService {
  constructor(
    private readonly scrapper: ScrapperService,
    private readonly cache: CacheService,
  ) {}

  async getSeries(id: number) {
    try {
      const json = await this.cache.getCache('SERIES' + id);
      const obj = JSON.parse(json);
      obj.cached = parseISO(obj.cached);
      obj.lastUpdated = parseISO(obj.lastUpdated);

      return obj as Series;
    } catch (error) {
      console.log(error);
    }
    const series = await this.scrapper.getSeries(id);
    this.cache.setCache('SERIES' + id, JSON.stringify(series));

    return series;
  }
}
