// src/course/dto/create-course.dto.ts
import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { Visibility } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsString()
  visibility: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds: string[];

  


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagNames?: string[]; // Optional tag creation
}
