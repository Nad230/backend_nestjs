// src/room/dto/create-room.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  type?: string;


  @IsOptional()
  @IsString()
  visibility: string;
  @IsOptional()
  @IsString()
  memberIds?: string[]; // Add this for additional members

  @IsOptional()
  @IsString()
  courseId?: string; // Optional link to a course

  @IsOptional()
  @IsString()
  status?: string; // Optional link to a course
}
