import { IsString, IsOptional } from 'class-validator';

export class UpdateCommentDTO {
  @IsString()
  @IsOptional()
  content?: string;
}