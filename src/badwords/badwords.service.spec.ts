import { Test, TestingModule } from '@nestjs/testing';
import { BadwordsService } from './badwords.service';

describe('BadwordsService', () => {
  let service: BadwordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadwordsService],
    }).compile();

    service = module.get<BadwordsService>(BadwordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
