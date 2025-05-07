import { IsString, IsOptional } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  parentId?: string; // Make `parentId` optional
}