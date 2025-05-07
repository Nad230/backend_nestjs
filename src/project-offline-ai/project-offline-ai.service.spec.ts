import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOfflineAiService } from './project-offline-ai.service';

describe('ProjectOfflineAiService', () => {
  let service: ProjectOfflineAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectOfflineAiService],
    }).compile();

    service = module.get<ProjectOfflineAiService>(ProjectOfflineAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
