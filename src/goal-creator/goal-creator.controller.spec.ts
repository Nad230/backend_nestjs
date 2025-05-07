import { Test, TestingModule } from '@nestjs/testing';
import { GoalCreatorController } from './goal-creator.controller';

describe('GoalCreatorController', () => {
  let controller: GoalCreatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalCreatorController],
    }).compile();

    controller = module.get<GoalCreatorController>(GoalCreatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
