import { Test, TestingModule } from '@nestjs/testing';
import { RssFeedResolver } from './rss-feed.resolver';
import { RssFeedService } from './rss-feed.service';

describe('RssFeedResolver', () => {
  let resolver: RssFeedResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RssFeedResolver, RssFeedService],
    }).compile();

    resolver = module.get<RssFeedResolver>(RssFeedResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
