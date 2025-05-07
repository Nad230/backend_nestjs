import { Module } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';

@Module({
  providers: [PresentationService],
  controllers: [PresentationController]
})
export class PresentationModule {}
