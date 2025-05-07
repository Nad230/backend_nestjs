import { Test, TestingModule } from '@nestjs/testing';
import { CreatorAiService } from './creator-ai.service';

describe('CreatorAiService', () => {
  let service: CreatorAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorAiService],
    }).compile();

    service = module.get<CreatorAiService>(CreatorAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
