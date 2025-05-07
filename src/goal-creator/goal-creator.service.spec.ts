import { Test, TestingModule } from '@nestjs/testing';
import { GoalCreatorService } from './goal-creator.service';

describe('GoalCreatorService', () => {
  let service: GoalCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalCreatorService],
    }).compile();

    service = module.get<GoalCreatorService>(GoalCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
