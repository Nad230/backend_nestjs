import { IsBoolean, IsOptional } from "class-validator";

export class DeleteMessageDto {
    @IsBoolean()
    @IsOptional()
    forEveryone?: boolean = false;
  }