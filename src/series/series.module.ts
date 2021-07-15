import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { ScrapperModule } from 'src/scrapper/scrapper.module';
import { CacheService } from 'src/cache/cache.service';

@Module({
  providers: [SeriesResolver, SeriesService, CacheService],
  imports: [ScrapperModule],
})
export class SeriesModule {}
