import { Injectable } from '@nestjs/common';
import { ScrapperService } from 'src/scrapper/scrapper.service';

@Injectable()
export class MangaService {
  constructor(private readonly scrapper: ScrapperService) {}

  async findOne(id: number) {
    const manga = await this.scrapper.getManga(id);
    return manga;
  }
}
