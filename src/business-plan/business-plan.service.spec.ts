import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPlanService } from './business-plan.service';

describe('BusinessPlanService', () => {
  let service: BusinessPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessPlanService],
    }).compile();

    service = module.get<BusinessPlanService>(BusinessPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
