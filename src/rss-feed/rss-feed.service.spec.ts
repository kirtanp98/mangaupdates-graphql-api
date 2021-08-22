import { Test, TestingModule } from '@nestjs/testing';
import { PubSub } from 'graphql-subscriptions';
import { RssFeedService } from './rss-feed.service';

describe('RssFeedService', () => {
  let service: RssFeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RssFeedService,
        {
          provide: 'PUB_SUB',
          useValue: new PubSub(),
        },
      ],
    }).compile();

    service = module.get<RssFeedService>(RssFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
