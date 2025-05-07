import { Test, TestingModule } from '@nestjs/testing';
import { CitationController } from './citation.controller';

describe('CitationController', () => {
  let controller: CitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitationController],
    }).compile();

    controller = module.get<CitationController>(CitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
