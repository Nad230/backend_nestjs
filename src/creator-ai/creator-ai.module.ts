import { Module } from '@nestjs/common';
import { CreatorAiService } from './creator-ai.service';
import { CreatorAiController } from './creator-ai.controller';

@Module({
  providers: [CreatorAiService],
  controllers: [CreatorAiController]
})
export class CreatorAiModule {}
