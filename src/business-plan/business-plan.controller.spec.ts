import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPlanController } from './business-plan.controller';

describe('BusinessPlanController', () => {
  let controller: BusinessPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessPlanController],
    }).compile();

    controller = module.get<BusinessPlanController>(BusinessPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
