import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCitationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
 
  taskId: string

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
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

  @IsString()
  @IsNotEmpty()
  userId: string;
}
