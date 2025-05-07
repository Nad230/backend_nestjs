// src/course/dto/create-course.dto.ts
import { IsEnum, IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { Visibility } from '@prisma/client';

export class UpdateCourseDto {
 

  @IsOptional()
  @IsString()
  coverImage?: string;


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds: string[];

  


  @IsOptional()
  @IsNumber()
  rating:Number;
}
