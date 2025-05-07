import { IsString, IsOptional, IsDateString, IsArray, IsBoolean, IsUUID } from 'class-validator';

export class UpdateAcadTaskDto {
 

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;


 
}
