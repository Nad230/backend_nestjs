// creator-goal.dto.ts
import { IsString, IsEnum, IsNumber, IsOptional, IsArray, IsUUID, IsDate } from 'class-validator';
import { CreatorType, Platform } from '@prisma/client';

export class CreateCreatorGoalDto {
  @IsUUID()
  profileId: string;

  @IsString()
  creatorType: string;

  @IsString()
  platform: string;

  @IsString()
  goalId: string; // Identifier for the goal type (e.g., "subscribers", "watchtime")

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  metrics: string[];

  @IsNumber()
  targetValue: number;

  @IsOptional()
  @IsNumber()
  currentValue?: number = 0;

  @IsOptional()
  @IsNumber()
  progress?: number = 0;

  @IsOptional()
  @IsDate()
  deadline?: Date;
}