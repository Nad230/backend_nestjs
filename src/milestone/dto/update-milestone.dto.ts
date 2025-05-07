// src/milestone/dto/update-milestone.dto.ts
export class UpdateMilestoneDto {
    name?: string;
    description?: string;
    status?: string;
    startDate?: Date;
    dueDate?: Date;
    completedAt?: Date;
    assignedToId?: string;  // ID of the user assigned to this task
    assignedById?: string;  // ID of the user who assigned the task
    progress?: number;
    priority?: string;
    aiGenerated?: boolean;
    riskFactor?: number;
    estimatedTime?: number;
    visibility?: "public" | "private" | "team" | "custom";
    visibleTo?: string[]; // List of user/team IDs
  }