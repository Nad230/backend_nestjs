import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateAchievementDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  showed?: boolean;

  @IsOptional()
  @IsString()
  type?: string;
}
