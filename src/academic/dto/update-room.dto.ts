// src/room/dto/create-room.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto {
 

  @IsOptional()
  @IsString()
  status?: string; // Optional link to a course
}
