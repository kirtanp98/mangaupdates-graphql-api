import { Test, TestingModule } from '@nestjs/testing';
import { MangaService } from './manga.service';

describe('MangaService', () => {
  let service: MangaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MangaService],
    }).compile();

    service = module.get<MangaService>(MangaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
