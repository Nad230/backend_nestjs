import { IsString, IsOptional, IsEnum, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { ProjectType, RevenueModel, BudgetRange, Timeline, Visibility, ProjectStatus, FundingSource } from '@prisma/client';

export class CreateProjectDto {

  
  @IsString()
  name: string;
  
  @IsOptional()
  type: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  visionImpact?: string;

  

  @IsOptional()
  revenueModel?: string;

  @IsOptional()
  BudgetRange?: string;

  @IsOptional()
  TimeLine?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  teamMembers?: any; // JSON data for temporary members
  @IsOptional()
  visibility: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  media?: any; // JSON for images/videos
  @IsOptional()
  status: string;

  @IsOptional()
  collaborations?: any; // JSON for partnerships

  @IsOptional()
  FundingSource?: string;

  @IsOptional()
  @IsString()
  fundingSourceDetails?: string;

  @IsString()
  mainGoal: string; // JSON for milestones

  @IsOptional()
  estimatedCompletionDate?: any; // JSON for AI insights

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  planType?: string;
  
  @IsString()
  strategyModel:string;

  @IsOptional()
  @IsBoolean()
  aiUnlocked?: boolean;
}
