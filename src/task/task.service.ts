// src/task/task.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {  TaskPriority, TaskType } from '@prisma/client';
import { AchivementService } from 'src/achivement/achivement.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService,private achievementService: AchivementService  ) {}
  
  
  async create(userId: string, data: CreateTaskDto) {
    if (!data.milestoneId) {
      throw new BadRequestException('Milestone ID is required');
    }
  
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: data.milestoneId },
      include: { project: true },
    });
  
    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }
  
    if (milestone.project.userId !== userId) {
      throw new ForbiddenException('Access denied: You do not own this project');
    }
    if (data.assignedToId) {
      // Ensure the user exists as a team member of the specified team
      const teamMember = await this.prisma.teamMember.findFirst({
        where: {
          userId: data.assignedToId, // This is the user's ID, not the teamMember primary key
          teamId: data.teamId,       // Ensure they belong to the specified team
        },
      });
  
      if (!teamMember) {
        throw new BadRequestException("Invalid assignedToId. This user is not a member of the specified team.");
      }
  
      // Replace the provided assignedToId with the actual team member's ID
      data.assignedToId = teamMember.id;
    }
  
    const task = this.prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || 'ON_HOLD',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate,
        startDate: data.startDate,

        milestoneId: data.milestoneId,
        assignedToId: data.assignedToId ? data.assignedToId : undefined,
        assignedBy: userId, 
        
        estimatedTime: data.estimatedTime,
        teamId: data.teamId,
        dependencyStatus: data.dependencyStatus,
      },
    });

    await this.achievementService.checkTaskAchievements(userId);

    return task
  }
  async getCurrentTask(userId: string) {
    const today = new Date();
    console.log(`Fetching current task for user: ${userId} on date: ${today}`);
  
    const currentTask = await this.prisma.task.findFirst({
      where: {
        OR: [
          { assignedTo: { userId: userId } }, // The user is assigned to the task
          { assignedToId: null, milestone: { project: { userId: userId } } } // No assignee, owner works on it
        ],
        startDate: { lte: today },
        dueDate: { gte: today },
        status: { not: "Completed" }
      },
      orderBy: [
        { priority: "desc" },  // High-priority tasks first
        { startDate: "asc" }   // Earliest task first if same priority
      ],
      include: {
        assignedTo: true,
        milestone: { include: { project: true } },
        TaskComment: true,
        TaskDependency: true,
        TimeEntry: true,
      }
    });
  
    console.log("Current task found:", currentTask);
  
    if (!currentTask) {
      console.log("No active task found. Fetching next upcoming task...");
      const nextTask = await this.prisma.task.findFirst({
        where: {
          OR: [
            { assignedTo: { userId: userId } },
            { assignedToId: null, milestone: { project: { userId: userId } } }
          ],
          startDate: { gt: today },
          status: { not: "Completed" }
        },
        orderBy: [
          { priority: "desc" },  
          { startDate: "asc" }
        ],
        include: {
          assignedTo: true,
          milestone: { include: { project: true } },
          TaskComment: true,
          TaskDependency: true,
          TimeEntry: true,
        }
      });
  
      console.log("Next upcoming task found:", nextTask);
      return nextTask;
    }
  
    return currentTask;
  }
  
  async getAll(userId: string) {
    return this.prisma.milestone.findMany({
      where: {
        OR: [
          { assignedToId: userId },
          { tasks: { some: { assignedToId: userId } } },
          { project: { userId: userId } } // Include milestones for projects you own
        ]
      },
      include: {
        project: true,
        tasks: {
          include: {
            assignedTo: true,
            assignedByUser: true,
            team: true,
          }
        }
      }
    });
  }
  
  
  async getById(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        milestone: { project: { userId: userId } },
      },
      include: {
        assignedTo: true,
        assignedByUser: true,
        milestone: { include: { project: true } },
        team: true,
        TaskComment: true,
        TaskDependency: true,
        TimeEntry: true,
      },
    });
  
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  
    return task;
  }
  
  async getTasksByProjectId(userId: string, projectId: string) {
    return this.prisma.task.findMany({
      where: {
        milestone: {
          projectId: projectId,
          project: { userId: userId },
        },
      },
      include: {
        assignedTo: true,
        milestone: true,
      },
    });
  }
  async getTaskAIFieldsByIds(userId: string, taskIds: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        id:  taskIds ,  // Filters tasks by provided task IDs
      },
      select: {
        id: true,
        name: true,
      },
    });
  
    if (!tasks.length) {
      throw new NotFoundException('No AI-generated task data found for the given task IDs');
    }
  
    return { message: 'AI fields retrieved from selected tasks', tasks };
  }
  
  async getTaskAIFields(userId: string, projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where:{ milestone: {
        projectId: projectId,
        project: { userId: userId },
      },},
      select: {
        id: true,
        name: true,
      },
    });
  
    if (!tasks.length) {
      throw new NotFoundException('No AI-generated task data found for this project');
    }
  
    return { message: 'AI fields retrieved from tasks', tasks };
  }
  async getTasksByMemberId(userId: string) {
    console.log("Fetching tasks for userId:", userId);
  
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [
          { assignedBy: userId }, // Tasks where the user is the owner
          { assignedTo: { userId: userId } }, // Tasks where the user is assigned
        ],
      },
      include: {
        assignedTo: true,
        milestone: true,
      },
    });
  
    console.log("Tasks found:", tasks);
    return tasks;
  }
  
  
  
  async update(userId: string, taskId: string, data: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { milestone: { include: { project: true } } },
    });
  
    if (!existing || existing.milestone.project.userId !== userId) {
      throw new NotFoundException('Task not found or access denied');
    }
  
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        startDate:data.startDate,
        completedAt: data.completedAt,
        // Use `assignedToId` and `assignedById` correctly
        assignedToId: data.assignedToId ? data.assignedToId : undefined,
        assignedBy: data.assignedById ? data.assignedById : undefined,
        
        estimatedTime: data.estimatedTime,
        actualTime: data.actualTime,
        dependencyStatus: data.dependencyStatus,
        teamId: data.teamId ?? undefined, // Ensure correct typing
      },
    });
  }
  
  
  async delete(userId: string, taskId: string) {
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { milestone: { include: { project: true } } },
    });
  
    if (!existing || existing.milestone.project.userId !== userId) {
      throw new NotFoundException('Task not found or access denied');
    }
  
    await this.prisma.task.delete({
      where: { id: taskId },
    });
  
    return { message: 'Task deleted successfully' };
  }




  private readonly statusProgressMap: { [key: string]: number } = {
    'Not Started': 0,
    'Initiated': 30,
    'In Progress': 50,
    'Near Completion': 70,
    'Completed': 100,
  };

  // Function to retrieve task status and map to progress
  async getTaskProgressById(taskId: string): Promise<number> {
    // Query the database to retrieve the task's status
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { status: true },
    });
  
    if (!task || !task.status) {
      throw new NotFoundException(`Task with ID ${taskId} not found or has no status.`);
    }
  
    // Map the status to the corresponding progress percentage
    const progress = this.statusProgressMap[task.status];
    if (progress === undefined) {
      throw new NotFoundException(`Progress mapping not found for status: ${task.status}`);
    }
  
    return progress;
  }
  






  async getTaskStats(userId: string, projectId: string) {
    // Check if the user is associated with the project (owner or team member)
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId }, 
          { team: { members: { some: { userId } } } }
        ],
      },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('User does not have access to this project');
    }

    // Base filter for tasks linked to milestones within the given project
    const baseFilter = {
      milestone: {
        projectId,
      },
    };

    // Status-based counts
    const totalTasks = await this.prisma.task.count({ where: baseFilter });
    const completedTasks = await this.prisma.task.count({ where: { ...baseFilter, status: "completed" } });
    const activeTasks = await this.prisma.task.count({ where: { ...baseFilter, status: "active" } });
    const ideaTasks = await this.prisma.task.count({ where: { ...baseFilter, status: "idea" } });
    const inProgressTasks = await this.prisma.task.count({ where: { ...baseFilter, status: "in_progress" } });
    const pausedTasks = await this.prisma.task.count({ where: { ...baseFilter, status: "paused" } });
    const planningTasks = await this.prisma.task.count({ where: { ...baseFilter, status: "planning" } });
    const notstartedTasks = await this.prisma.task.count({ where: { ...baseFilter, status: "not_started" } });

    // Priority-based counts
    const lowPriorityTasks = await this.prisma.task.count({ where: { ...baseFilter, priority: "low" } });
    const mediumPriorityTasks = await this.prisma.task.count({ where: { ...baseFilter, priority: "medium" } });
    const highPriorityTasks = await this.prisma.task.count({ where: { ...baseFilter, priority: "high" } });
    
    return {
      totalTasks,
      completedTasks,
      activeTasks,
      ideaTasks,
      inProgressTasks,
      pausedTasks,
      planningTasks,
      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks,
      notstartedTasks
    };
}

async getTaskStatsWithProgress(userId: string, projectId: string) {
  // Fetch task statistics
  const taskStats = await this.getTaskStats(userId, projectId);

  // Calculate progress percentage
  const progress = taskStats.totalTasks > 0 
      ? (taskStats.completedTasks / taskStats.totalTasks) * 100 
      : 0;

  return {
      ...taskStats,
      progress: progress.toFixed(2) // Keep two decimal places
  };
}





  async  getProjectTimeStats(projectId: string) {
    // Aggregate the total estimated time for tasks whose milestone is linked to the project
    const estimated = await this.prisma.task.aggregate({
      where: {
        milestone: {
          project: {
            id: projectId,
          },
        },
      },
      _sum: { estimatedTime: true },
    });
  
    // Retrieve tasks with non-null startDate and completedAt from the nested relations
    const tasks = await this.prisma.task.findMany({
      where: {
        milestone: {
          project: {
            id: projectId,
          },
        },
        completedAt: { not: null },
        startDate: { not: null }
      },
      select: {
        startDate: true,
        completedAt: true,
      },
    });
  
    // Calculate the total actual time in hours with a runtime check for non-null dates.
    const actualTime = tasks.reduce((total, task) => {
      if (task.completedAt && task.startDate) {
        const duration = (task.completedAt.getTime() - task.startDate.getTime()) / (1000 * 60 * 60);
        return total + duration;
      }
      return total;
    }, 0);
  
    return {
      estimatedTime: estimated._sum.estimatedTime || 0,
      actualTime,
    };
  }
  
  async getUpcomingDeadlines(projectId: string) {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
  
    const tasks = await this.prisma.task.findMany({
      where: {
        milestone: {
          project: {
            id: projectId,
          },
        },
        dueDate: {
          gte: today, // Greater than or equal to today
          lte: nextWeek, // Less than or equal to 7 days from today
        },
      },
      select: {
        id: true,
        name: true,
        dueDate: true,
        status:true,
        priority:true,
      },
    });
  
    return tasks;
  }
  
  
}


  
  
