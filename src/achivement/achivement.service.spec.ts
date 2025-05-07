import { Test, TestingModule } from '@nestjs/testing';
import { AchivementService } from './achivement.service';

describe('AchivementService', () => {
  let service: AchivementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchivementService],
    }).compile();

    service = module.get<AchivementService>(AchivementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
