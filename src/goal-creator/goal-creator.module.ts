import { Module } from '@nestjs/common';
import { GoalCreatorController } from './goal-creator.controller';
import { GoalCreatorService } from './goal-creator.service';

@Module({
    providers: [GoalCreatorService],
  controllers: [GoalCreatorController]
})
export class GoalCreatorModule {}
