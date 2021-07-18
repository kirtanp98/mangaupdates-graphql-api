import { Test, TestingModule } from '@nestjs/testing';
import { SeriesResolver } from './series.resolver';
import { SeriesService } from './series.service';
import { ScraperModule } from '../scraper/scraper.module';
import { ScraperService } from '../scraper/scraper.service';
import { CacheService } from 'src/cache/cache.service';
import { MockCacheService } from 'src/cache/mock.cache.service';

describe('SeriesResolver', () => {
  let resolver: SeriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScraperModule],
      providers: [
        ScraperService,
        SeriesResolver,
        SeriesService,
        { provide: CacheService, useClass: MockCacheService },
      ],
    }).compile();

    resolver = module.get<SeriesResolver>(SeriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
