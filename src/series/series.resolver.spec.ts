import { Test, TestingModule } from '@nestjs/testing';
import { SeriesResolver } from './series.resolver';
import { SeriesService } from './series.service';
import { ScrapperModule } from '../scrapper/scrapper.module';
import { ScrapperService } from '../scrapper/scrapper.service';

describe('SeriesResolver', () => {
  let resolver: SeriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScrapperModule],
      providers: [ScrapperService, SeriesResolver, SeriesService],
    }).compile();

    resolver = module.get<SeriesResolver>(SeriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
