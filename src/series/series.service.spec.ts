import { Test, TestingModule } from '@nestjs/testing';
import { SeriesService } from './series.service';
import { ScraperModule } from '../scraper/scraper.module';
import { ScraperService } from '../scraper/scraper.service';
import { CacheService } from 'src/cache/cache.service';
import { MockCacheService } from 'src/cache/mock.cache.service';

describe('SeriesService', () => {
  let service: SeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScraperModule],
      providers: [
        ScraperService,
        SeriesService,
        { provide: CacheService, useClass: MockCacheService },
      ],
    }).compile();

    service = module.get<SeriesService>(SeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
