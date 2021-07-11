import { Injectable } from '@nestjs/common';
import { ScrapperService } from 'src/scrapper/scrapper.service';

@Injectable()
export class SeriesService {
  constructor(private readonly scrapper: ScrapperService) {}

  async getSeries(id: number) {
    return await this.scrapper.getSeries(id);
  }
}
