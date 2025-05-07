import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaCronService } from './social-media-cron.service';

describe('SocialMediaCronService', () => {
  let service: SocialMediaCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialMediaCronService],
    }).compile();

    service = module.get<SocialMediaCronService>(SocialMediaCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
