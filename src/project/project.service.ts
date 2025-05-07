// src/project/project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AchivementService } from 'src/achivement/achivement.service';
import axios from 'axios';
import { AIService } from 'src/ai/ai.service';
import { AIDetails } from 'src/ai/types';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';


@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService, private achievementService: AchivementService
  ) {}
  

  
  
    

  
  

  



  async create(userId: string, data: CreateProjectDto) {
    if (!userId) {
      throw new Error("User ID is missing in request.");
    }
  
    console.log("Received mainGoal:", data.mainGoal); // Debugging log
  
    // Wait for project creation to complete first
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        userId: userId,
        type: data.type,
        visibility: data.visibility,
        status: data.status,
        timeline: data.TimeLine,
        teamId: data.teamId,
        tags: data.tags,
        mainGoal: data.mainGoal,
        estimatedCompletionDate: data.estimatedCompletionDate,
      },
    });
  
    console.log(`Project created with ID: ${project.id}`);
  
    // Now that the project exists, check achievements
    await this.achievementService.checkProjectAchievements(userId);
  
    return project;
  }
  
    
  

 






  async update(userId: string, projectId: string, data: UpdateProjectDto) {
    if (!userId) {
      throw new Error("User ID is missing in request.");
    }
  
    // Check if project belongs to user
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
  
    if (!project || project.userId !== userId) {
      throw new Error("Project not found or access denied.");
    }
  
    // Update project
    const updatedProject= this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
        type: data.type ,
        visibility: data.visibility ,
        status: data.status ,
        teamType:data.teamType
      },
    });
    if (project.status !== 'completed' && (await updatedProject).status === 'completed') {
      await this.achievementService.checkCompletedProjectAchievements(userId);
    }

    return updatedProject;
  }
  async delete(userId: string, projectId: string) {
    if (!userId) {
      throw new Error("User ID is missing in request.");
    }
  
    // Check if project belongs to user
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: {
          include: {
            tasks: true
          }
        }
      }
    });
  
    if (!project || project.userId !== userId) {
      throw new Error("Project not found or access denied.");
    }
    return this.prisma.$transaction(async (prisma) => {
      // Delete all tasks associated with project's milestones
      await prisma.task.deleteMany({
        where: {
          milestoneId: {
            in: project.milestones.map(m => m.id)
          }
        }
      });
  
      // Delete all project milestones
      await prisma.milestone.deleteMany({
        where: { projectId }
      });
  
      // Finally delete the project
      await prisma.project.delete({
        where: { id: projectId }
      });
  
      return { message: "Project deleted successfully" };
    });
  }
  async getAll(userId: string) { 
    return this.prisma.project.findMany({
      where: {
        OR: [
          { 
            userId: userId // Only show projects that the user created
          },
          { 
            team: {
              is: {
                members: {
                  some: { userId: userId } // Only show if user is in the team
                }
              }
            } 
          }
        ],
      },
    });
}


  

  // Get a specific project by ID
  async getById(userId: string, projectId: string) {
    return this.prisma.project.findFirst({
        where: {
            id: projectId,
            OR: [
                { userId }, // The owner of the project
                { 
                    team: {
                        is: { 
                            members: { 
                                some: { userId: userId } // Check if user is a team member
                            } 
                        } 
                    } 
                }
            ]
        },
        select: {
            id: true,
            name: true,
            description: true,
            userId: true, 
            mainGoal:true,
            estimatedCompletionDate:true,
            status:true,
            team: {
                select: {
                    id: true,
                    members: {
                        select: { userId: true }
                    }
                }
            }
        }
    });
}
async getProjectAIInsights(userId: string, projectId: string) {
  const project = await this.prisma.project.findUnique({
    where: { id: projectId },
    select: { aiInsights: true },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  return { message: 'AI insights retrieved', aiInsights: project.aiInsights };
}



  async monthlyGrowth(userId: string) {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));
  
    // Get completed projects in the current month
    const currentMonthCompleted = await this.prisma.project.count({
      where: {
        userId,
        status: "completed",
        completedAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });
  
    // Get completed projects in the last month
    const lastMonthCompleted = await this.prisma.project.count({
      where: {
        OR: [
          { userId }, // Projects owned by the user
          { 
            team: { // Join the Team table
              members: { some: { userId } }
              // Check if user is a team member
            }
          }
        ],
        status: "completed",
        completedAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });
    
    console.log("Current Month Completed:", currentMonthCompleted);
    console.log("Last Month Completed:", lastMonthCompleted);
  
    // Calculate growth percentage
    let growthPercentage = 0;
    if (lastMonthCompleted === 0) {
      growthPercentage = currentMonthCompleted > 0 ? 100 : 0;
    } else {
      growthPercentage = ((currentMonthCompleted - lastMonthCompleted) / lastMonthCompleted) * 100;
    }
  
    return {
      currentMonthCompleted,
      lastMonthCompleted,
      growthPercentage: parseFloat(growthPercentage.toFixed(2)), // Keep only 2 decimal places
    };
  }
  
  
async getProjectStats(userId: string) {
  const totalProjects = await this.prisma.project.count({
    where: {
      OR: [
        { userId },
        { team: { members: { some: { userId } }
      } } // Join team and check for userId
      ],
    },
  });

  const completedProjects = await this.prisma.project.count({
    where: {
      OR: [{ userId }, { team: {members: { some: { userId } }
      } }],
      status: "completed",
    },
  });

  const activeProjects = await this.prisma.project.count({
    where: {
      OR: [{ userId }, { team: { members: { some: { userId } 
      } } }],
      status: "active",
    },
  });

  const IdeaProjects = await this.prisma.project.count({
    where: {
      OR: [{ userId }, { team: { members: { some: { userId } }
      } }],
      status: "idea",
    },
  });

  const InProgressProjects = await this.prisma.project.count({
    where: {
      OR: [{ userId }, { team: { members: { some: { userId } 
 } } }],
      status: "in_progress",
    },
  });

  const PausedProjects = await this.prisma.project.count({
    where: {
      OR: [{ userId }, { team: { members: { some: { userId } }
      } }],
      status: "paused",
    },
  });

  const PlanningProjects = await this.prisma.project.count({
    where: {
      OR: [{ userId }, { team: { members: { some: { userId } }
      } }],
      status: "planning",
    },
  });

  const archivedProjects = await this.prisma.project.count({
    where: {
      OR: [{ userId }, { team: { members: { some: { userId } }
      } }],
      visibility: "private",
    },
  });

  return {
    totalProjects,
    completedProjects,
    activeProjects,
    InProgressProjects,
    PausedProjects,
    IdeaProjects,
    PlanningProjects,
    archivedProjects,
  };
}
















// Function to retrieve task status and map to progress
async getProjectProgressById(projectId: string): Promise<number> {
  // Query the database to count total and completed milestones
  const totalMilestones = await this.prisma.milestone.count({
    where: { projectId },
  });

  const completedMilestones = await this.prisma.milestone.count({
    where: { projectId, status: 'completed' }, // Assuming 'COMPLETED' is the status for finished milestones
  });

  if (totalMilestones === 0) {
    return 0; // Avoid division by zero; progress is 0% if no milestones exist
  }

  // Calculate progress as a percentage
  const progress = (completedMilestones / totalMilestones) * 100;

  return progress;
}





async getProjectTimeMetrics(projectId: string) {
  // Retrieve the project's timing details
  const project = await this.prisma.project.findUnique({
    where: { id: projectId },
    select: {
      createdAt: true,
      estimatedCompletionDate: true,
      completedAt: true,
    },
  });

  if (!project) {
    throw new Error(`Project with id ${projectId} not found.`);
  }

  if (!project.createdAt || !project.estimatedCompletionDate) {
    throw new Error('Project must have both a startDate and an estimatedCompletionDate.');
  }

  const actualEndDate = project.completedAt || new Date();

  // Calculate durations in days
  const totalDurationDays = Math.round(
    (project.estimatedCompletionDate.getTime() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const elapsedDays = Math.round(
    (actualEndDate.getTime() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Compute time elapsed percentage (capped at 100%)
  let timeElapsedPercentage = totalDurationDays > 0 ? (elapsedDays / totalDurationDays) * 100 : 0;
  timeElapsedPercentage = Math.min(100, Math.round(timeElapsedPercentage));

  // Calculate remaining days (negative if overdue)
  const daysRemaining = totalDurationDays - elapsedDays;

  return {
    timeElapsedPercentage,
    daysRemaining,
    totalDurationDays, // New field for more clarity
  };
}


}