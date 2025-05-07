import { IsArray, IsBoolean, IsOptional, IsString, ArrayMinSize } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @ArrayMinSize(1)
  participantIds: string[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isGroup?: boolean = false;
}