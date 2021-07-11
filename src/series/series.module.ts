import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { ScrapperModule } from 'src/scrapper/scrapper.module';

@Module({
  providers: [SeriesResolver, SeriesService],
  imports: [ScrapperModule],
})
export class SeriesModule {}
