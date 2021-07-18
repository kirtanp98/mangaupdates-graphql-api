import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { MockCacheService } from './mock.cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CacheService, useClass: MockCacheService }],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
