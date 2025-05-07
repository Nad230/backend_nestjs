import { Test, TestingModule } from '@nestjs/testing';
import { CreatorAiController } from './creator-ai.controller';

describe('CreatorAiController', () => {
  let controller: CreatorAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorAiController],
    }).compile();

    controller = module.get<CreatorAiController>(CreatorAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
