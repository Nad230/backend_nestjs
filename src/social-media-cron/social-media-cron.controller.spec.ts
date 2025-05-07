import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaCronController } from './social-media-cron.controller';

describe('SocialMediaCronController', () => {
  let controller: SocialMediaCronController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialMediaCronController],
    }).compile();

    controller = module.get<SocialMediaCronController>(SocialMediaCronController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
