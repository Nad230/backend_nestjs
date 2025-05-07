import { Test, TestingModule } from '@nestjs/testing';
import { CitationService } from './citation.service';

describe('CitationService', () => {
  let service: CitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitationService],
    }).compile();

    service = module.get<CitationService>(CitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
