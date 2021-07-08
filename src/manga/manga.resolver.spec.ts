import { Test, TestingModule } from '@nestjs/testing';
import { MangaResolver } from './manga.resolver';
import { MangaService } from './manga.service';

describe('MangaResolver', () => {
  let resolver: MangaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MangaResolver, MangaService],
    }).compile();

    resolver = module.get<MangaResolver>(MangaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
