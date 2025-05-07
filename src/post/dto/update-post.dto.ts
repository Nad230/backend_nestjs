// src/post/dto/update-post.dto.ts
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { Privacy } from '@prisma/client';

export class UpdatePostDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsEnum(Privacy)
  privacy?: Privacy;
}