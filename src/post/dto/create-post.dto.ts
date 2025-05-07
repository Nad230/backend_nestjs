import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { Privacy, MediaType } from '@prisma/client';

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  content: string;


  @IsOptional()
  @IsEnum(Privacy)
  privacy?: Privacy;

  
}
