import { IsString, IsOptional, IsArray, IsInt, IsUUID } from 'class-validator';

export class CreateCitationDto {
  @IsString()
  title: string;

  @IsString()
  authors: string;

  @IsInt()
  year: number;

  @IsString()
  journal: string;

  @IsOptional()
  @IsString()
  doi?: string;

  @IsArray()
  @IsString({ each: true })
  citedIn: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsUUID()
  userId: string; // Required to link to a specific user
   @IsUUID()
    taskId: string
}
