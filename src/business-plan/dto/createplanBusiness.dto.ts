import { IsOptional, IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreatebusinessplanDto {
  @IsOptional()
  @IsString()
  projectName?: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  BudgetRange?: number;
}
