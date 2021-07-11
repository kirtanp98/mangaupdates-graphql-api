import { Test, TestingModule } from '@nestjs/testing';
import { SeriesResolver } from './series.resolver';
import { SeriesService } from './series.service';

describe('SeriesResolver', () => {
  let resolver: SeriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeriesResolver, SeriesService],
    }).compile();

    resolver = module.get<SeriesResolver>(SeriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
