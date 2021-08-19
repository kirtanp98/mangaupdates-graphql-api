import { Test, TestingModule } from '@nestjs/testing';
import { RssFeedService } from './rss-feed.service';

describe('RssFeedService', () => {
  let service: RssFeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RssFeedService],
    }).compile();

    service = module.get<RssFeedService>(RssFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
