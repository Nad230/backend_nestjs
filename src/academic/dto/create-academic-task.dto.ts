import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator'
import { Priority, Status } from '@prisma/client'

export class CreateAcademicTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  projectId: string

  @IsUUID()
  assigneeId: string

  @IsUUID()
  @IsNotEmpty()
  assignedById: string

  @IsDateString()
  @IsOptional()
  deadline?: string

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority

  @IsEnum(Status)
  @IsOptional()
  status?: Status

  @IsString()
  @IsOptional()
  notes?: string
   
}
