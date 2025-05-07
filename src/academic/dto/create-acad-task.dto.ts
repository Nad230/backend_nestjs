import { IsString, IsOptional, IsDateString, IsArray, IsBoolean, IsUUID, IsNumber } from 'class-validator';

export class CreateAcadTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  deadline: string;

  @IsUUID()
  createdById: string; // user ID of the creator (student or teacher)

  @IsOptional()
  @IsUUID()
  courseId?: string; // optional course ID

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsBoolean()
  isClosed?: boolean; // default false, whether the task is open or closed

  @IsOptional()
    @IsNumber()
    maxPoints:number;
}
