import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Module({
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
