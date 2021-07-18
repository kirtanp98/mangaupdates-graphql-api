import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { ScraperModule } from 'src/scraper/scraper.module';
import { CacheService } from 'src/cache/cache.service';

@Module({
  providers: [SeriesResolver, SeriesService, CacheService],
  imports: [ScraperModule],
})
export class SeriesModule {}
