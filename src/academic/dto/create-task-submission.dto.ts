// src/academic/dto/create-task-submission.dto.ts
import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateTaskSubmissionDto {
  @IsUUID()
  taskId: string;
  @IsUUID()
  studentId: string;

  @IsUUID()
  fileId: string;

  // Optional fields (usually added later by teacher)
  @IsOptional()
  @IsNumber()
  grade?: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsNumber()
  points?: number;
}
