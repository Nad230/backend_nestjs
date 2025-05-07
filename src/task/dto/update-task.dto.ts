// src/task/dto/update-task.dto.ts
import {  TaskPriority, TaskType } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';

export class UpdateTaskDto {
  name?: string;
  description?: string;
  status?: string;
  priority?: TaskPriority;
  type?: TaskType;
  dueDate?: Date;
  completedAt?: Date;
  estimatedTime?: number;
  actualTime?: number;
  dependencyStatus?: string;
  aiSuggestions?: InputJsonValue;
  aiPriorityAdjustment?: string;
  aiTaskOptimization?: InputJsonValue;
  teamId?: string;
  assignedToId?: string;  // ID of the user assigned to this task
  assignedById?: string;  // ID of the user who assigned the task
  bestAction?:string;
  timeAllocation?:string;
  startDate?: Date;
}