import { Test, TestingModule } from '@nestjs/testing';
import { AchivementController } from './achivement.controller';

describe('AchivementController', () => {
  let controller: AchivementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchivementController],
    }).compile();

    controller = module.get<AchivementController>(AchivementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
