import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOfflineAiController } from './project-offline-ai.controller';

describe('ProjectOfflineAiController', () => {
  let controller: ProjectOfflineAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectOfflineAiController],
    }).compile();

    controller = module.get<ProjectOfflineAiController>(ProjectOfflineAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
