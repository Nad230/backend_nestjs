// update-creator-goal.dto.ts
// creator-goal.dto.ts
import { IsString, IsEnum, IsNumber, IsOptional, IsArray, IsUUID, IsDate } from 'class-validator';
export class UpdateCreatorGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metrics?: string[];

  @IsOptional()
  @IsNumber()
  targetValue?: number;

  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsDate()
  deadline?: Date;
}