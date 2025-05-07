import { IsOptional, IsString, IsUUID, IsDateString, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTimeEntryDto {
    @IsNotEmpty()
    @IsUUID() // Ensures valid UUID
    projectId: string;

    @IsOptional()
    @IsUUID() // Since taskId is optional in your model
    taskId?: string;

    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsUUID()
    teamId?: string;

    @IsNotEmpty()
    @IsDateString() // Ensures valid date format
    startTime: Date;

    @IsOptional()
    @IsDateString()
    endTime?: Date;

    @IsOptional()
    @IsNumber()
    duration?: number;

    @IsOptional()
    @IsNumber()
    breakDuration?: number;

    @IsOptional()
    @IsString()
    status?: string; // "in-progress", "completed", etc.

    @IsOptional()
    @IsBoolean()
    billable?: boolean;

    @IsOptional()
    @IsBoolean()
    manualEntry?: boolean;

    @IsOptional()
    @IsString()
    notes?: string;
}
