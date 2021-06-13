import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaResolver } from './manga.resolver';
import { ScrapperModule } from 'src/scrapper/scrapper.module';

@Module({
  providers: [MangaResolver, MangaService],
  imports: [ScrapperModule],
})
export class MangaModule {}
