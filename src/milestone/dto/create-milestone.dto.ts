// src/milestone/dto/create-milestone.dto.ts
export class CreateMilestoneDto {
    projectId: string;
    name: string;
    description?: string;
    status?: string;
    startDate?: Date;
    dueDate?: Date;
    completedAt?: Date;
    progress?: number;
    priority?: string;
    aiGenerated?: boolean;
    riskFactor?: number;
    estimatedTime?: number;
    visibility?: "public" | "private" | "team" | "custom";
    visibleTo?: string[]; // List of user/team IDs
    assignedToId?: string;  // ID of the user assigned to this task
    assignedById?: string;  // ID of the user who assigned the task
  }