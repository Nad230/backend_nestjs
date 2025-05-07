import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { GoalCreatorService } from './goal-creator.service';
import { CreateCreatorGoalDto } from './dto/create-creator-goal.dto';
import { UpdateCreatorGoalDto } from './dto/update-creator-goal.dto';

@Controller('creator-goals')
export class GoalCreatorController {
  constructor(private readonly goalCreatorService: GoalCreatorService) {}
/*
  @Post()
  async create(@Body() createCreatorGoalDto: CreateCreatorGoalDto) {
    return this.goalCreatorService.createGoal(createCreatorGoalDto);
  }

  @Get()
  async getAll() {
    return this.goalCreatorService.getAllGoals();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.goalCreatorService.getGoalById(id);
  }

  @Get('profile/:profileId')
  async getByProfileId(@Param('profileId') profileId: string) {
    return this.goalCreatorService.getGoalsByProfileId(profileId);
  }

  */
}
