import { IsString, IsOptional, IsEnum, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { ProjectType, RevenueModel, BudgetRange, Timeline, Visibility, ProjectStatus, FundingSource } from '@prisma/client';

export class UpdateProjectDto {
   @IsString()
    name: string;
  
    @IsEnum(ProjectType)
    type: ProjectType;
  
    @IsArray()
    @IsString({ each: true })
    tags: string[];
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsString()
    vision?: string;
  
    @IsOptional()
    @IsString()
    impact?: string;
  
    @IsOptional()
    @IsEnum(RevenueModel)
    revenueModel?: RevenueModel;
  
    @IsOptional()
    @IsEnum(BudgetRange)
    budgetRange?: BudgetRange;
  
    @IsOptional()
    @IsEnum(Timeline)
    timeline?: Timeline;
  
    @IsOptional()
    @IsUUID()
    teamId?: string;
  
    @IsOptional()
    teamMembers?: any; // JSON data for temporary members
  
    @IsEnum(Visibility)
    visibility: Visibility;
  
    @IsOptional()
    @IsString()
    location?: string;
  
    @IsOptional()
    media?: any; // JSON for images/videos
  
    @IsEnum(ProjectStatus)
    status: ProjectStatus;
  
    @IsOptional()
    collaborations?: any; // JSON for partnerships
  
    @IsOptional()
    @IsEnum(FundingSource)
    fundingSource?: FundingSource;
  
    @IsOptional()
    projectMilestones?: any; // JSON for milestones
    @IsOptional()
    @IsString()
    teamType?:string;
  
}
