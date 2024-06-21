import { Test, TestingModule } from '@nestjs/testing';
import { BadwordsController } from './badwords.controller';
import { BadwordsService } from './badwords.service';

describe('BadwordsController', () => {
  let controller: BadwordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BadwordsController],
      providers: [BadwordsService],
    }).compile();

    controller = module.get<BadwordsController>(BadwordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
