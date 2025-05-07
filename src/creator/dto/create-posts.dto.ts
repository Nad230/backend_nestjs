import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  profileId: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hashtags: string[] = [];

  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsNotEmpty()
  @IsOptional()
  scheduledAt?: Date;
  

}
