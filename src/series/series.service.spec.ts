import { Test, TestingModule } from '@nestjs/testing';
import { SeriesService } from './series.service';
import { ScrapperModule } from '../scrapper/scrapper.module';
import { ScrapperService } from '../scrapper/scrapper.service';
import { CacheService } from 'src/cache/cache.service';
import { MockCacheService } from 'src/cache/mock.cache.service';

describe('SeriesService', () => {
  let service: SeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScrapperModule],
      providers: [
        ScrapperService,
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
