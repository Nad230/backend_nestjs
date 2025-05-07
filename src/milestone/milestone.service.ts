// src/milestone/milestone.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { AchivementService } from 'src/achivement/achivement.service';

@Injectable()
export class MilestoneService {
  constructor(private readonly prisma: PrismaService,private achievementService: AchivementService) {}

  async create(userId: string, data: CreateMilestoneDto) {
    console.log("Received Data:", data);
    console.log("AssignedToId:", data.assignedToId);
  
    // 1️⃣ Must have a project
    if (!data.projectId) {
      throw new BadRequestException("Project ID is required.");
    }
  
    // 2️⃣ Verify the project exists & belongs to this user
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });
    if (!project || project.userId !== userId) {
      throw new NotFoundException("Project not found or access denied.");
    }
  
    // 3️⃣ If assignedToId is provided, check if it's a valid team member in the project
    if (data.assignedToId) {
      // Get the project’s teamId first
      const projectWithTeam = await this.prisma.project.findUnique({
        where: { id: data.projectId },
        select: { teamId: true }, // Fetch the project's teamId
      });
  
      if (!projectWithTeam || !projectWithTeam.teamId) {
        throw new BadRequestException("This project has no team. You cannot assign a team member.");
      }
  
      // Check if the user is a valid team member of this project
      const teamMember = await this.prisma.teamMember.findFirst({
        where: {
          userId: data.assignedToId,
          teamId: projectWithTeam.teamId, // Ensure they belong to this project's team
        },
      });
  
      if (!teamMember) {
        throw new BadRequestException("Invalid assignedToId. This user is not part of the project's team.");
      }
  
      // Use the team member's ID in the milestone
      data.assignedToId = teamMember.id;
    }
  
    // 4️⃣ Now create the milestone
    const milestone = await this.prisma.milestone.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        dueDate: data.dueDate,
        priority: data.priority ?? 'medium',
        status: data.status ?? 'planned',
        estimatedTime: data.estimatedTime,
        assignedBy: userId, // Set the creator as assignedBy
        assignedToId: data.assignedToId,
        aiGenerated: data.aiGenerated ?? false,
        visibility: data.visibility ?? 'private',
        visibleTo: data.visibleTo ?? [],
        progress: data.progress ?? 0,
      },
    });
  
    // 5️⃣ Trigger any milestone-related achievements
    await this.achievementService.checkMilestoneAchievements(userId);
  
    return milestone;
  }


  async update(userId: string, milestoneId: string, data: UpdateMilestoneDto) {
    // 1️⃣ Fetch existing milestone & verify ownership
    const existing = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true },
    });
    if (!existing || existing.project.userId !== userId) {
      throw new NotFoundException("Milestone not found or access denied.");
    }
  
    // 2️⃣ If updating the assignedToId, check if it's a valid team member within the project
    if (data.assignedToId) {
      // Get the project’s teamId
      const projectWithTeam = await this.prisma.project.findUnique({
        where: { id: existing.project.id },
        select: { teamId: true }, // Fetch the project's teamId
      });
  
      if (!projectWithTeam || !projectWithTeam.teamId) {
        throw new BadRequestException("This project has no team. You cannot assign a team member.");
      }
  
      // Check if the user is a valid team member of this project
      const teamMember = await this.prisma.teamMember.findFirst({
        where: {
          userId: data.assignedToId,
          teamId: projectWithTeam.teamId,
        },
      });
  
      if (!teamMember) {
        throw new BadRequestException("Invalid assignedToId. This user is not part of the project's team.");
      }
  
      // Use the team member's ID in the milestone update
      data.assignedToId = teamMember.id;
    }
  
    // 3️⃣ Clean out undefined fields so Prisma won’t try to overwrite with null
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
  
    // 4️⃣ Merge fallbacks for any fields you want to preserve
    const payload = {
      ...cleanedData,
      progress: data.progress ?? existing.progress,
      status: data.status ?? existing.status,
      priority: data.priority ?? existing.priority,
      visibility: data.visibility ?? existing.visibility,
      visibleTo: data.visibleTo ?? existing.visibleTo,
      startDate: data.startDate ?? existing.startDate,
      dueDate: data.dueDate ?? existing.dueDate,
    };
  
    // 5️⃣ Apply the update
    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: payload,
    });
  }
  
  


 
  async getMilestonesByMemberId(userId: string) {
    return this.prisma.milestone.findMany({
      where: {
        assignedTo: {
          userId: userId, // Filter milestones where assigned member's userId matches
        },
      },
      include: {
        assignedTo: true,
        project: true, // Include project details if needed
      },
    });
  }
  
  

  async getAll(userId: string) {
    return this.prisma.milestone.findMany({
      where: {
        OR: [
          { project: { userId: userId } }, // Project owner sees all milestones
          { assignedTo: { userId: userId } }, // Check assignedTo → userId
          { tasks: { some: { assignedTo: { userId: userId } } } } // Check tasks assigned to this user
        ]
      },
      include: {
        tasks: {
          where: {
            OR: [
              { assignedTo: { userId: userId } }, // Tasks assigned to the user
              { milestone: { assignedTo: { userId: userId } } } // Tasks inside a milestone assigned to them
            ]
          }
        }
      }
    });
  }
  
  


async getById(userId: string, milestoneId: string) {
  const milestone = await this.prisma.milestone.findFirst({
    where: {
      id: milestoneId,
      OR: [
        { visibility: "public" }, // Anyone can see public milestones
        { project: { userId: userId } }, // Owner sees all their milestones
        { 
          visibility: "team",
          project: {
            team: {
              is: { 
                members: { 
                  some: { userId: userId } // Team members see "team" milestones
                } 
              } 
            }
          }
        },
        { 
          visibility: "custom",
          visibleTo: { has: userId } // Only specific users can see "custom" milestones
        }
      ]
    },
    include: {
      tasks: true,
    },
  });

  if (!milestone) {
    throw new NotFoundException('Milestone not found');
  }

  return milestone;
}

  async delete(userId: string, milestoneId: string) {
    const existing = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true },
    });

    if (!existing || existing.project.userId !== userId) {
      throw new NotFoundException('Milestone not found or access denied');
    }

    await this.prisma.milestone.delete({
      where: { id: milestoneId },
    });

    return { message: 'Milestone deleted successfully' };
  }


  private async getAssignedIdsRaw(milestoneId: string): Promise<string[]> {
    // Note: table name is "Milestone", column is "assignedToId"
    const rows = await this.prisma.$queryRaw<
      { assignedToId: string[] }[]
    >`SELECT "assignedToId" FROM "Milestone" WHERE id = ${milestoneId};`

    if (rows.length === 0) {
      return [];
    }
    return rows[0].assignedToId;
  }

  async getByProject(userId: string, projectId: string) {
    return this.prisma.milestone.findMany({
      where: {
        projectId: projectId,
        OR: [
          { project: { userId: userId } }, // Project owner sees all milestones
          { assignedTo: { user: { id: userId } } }, // Milestone assigned to user via TeamMember
          { tasks: { some: { assignedTo: { user: { id: userId } } } } } // Tasks within the milestone assigned to user
        ]
      },
      include: {
        tasks: {
          where: {
            OR: [
              { assignedTo: { user: { id: userId } } }, // Task assigned to the user via TeamMember
              { milestone: { assignedTo: { user: { id: userId } } } }, // Task inside a milestone assigned via TeamMember
              { milestone: { project: { userId: userId } } } // Task from a project owned by the user
            ]
          }
        }
        
      }
    });
  }
  



  async getMilestoneProgress(milestoneId: string): Promise<number> {
    // Count total tasks under the milestone
    const totalTasks = await this.prisma.task.count({
        where: { milestoneId }
    });

    // Count completed tasks under the milestone
    const completedTasks = await this.prisma.task.count({
        where: { milestoneId, status: "completed" }
    });

    // Calculate progress percentage
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return parseFloat(progress.toFixed(2)); // Keep two decimal places
}




  async getMilestoneStats(userId: string, projectId: string) {
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

    // Milestone stats using the given project ID
    const totalMilestones = await this.prisma.milestone.count({
      where: { projectId },
    });

    const completedMilestones = await this.prisma.milestone.count({
      where: { projectId, status: "completed" },
    });

    const activeMilestones = await this.prisma.milestone.count({
      where: { projectId, status: "active" },
    });



    const inProgressMilestones = await this.prisma.milestone.count({
      where: { projectId, status: "in_progress" },
    });

    const pausedMilestones = await this.prisma.milestone.count({
      where: { projectId, status: "paused" },
    });

 

    return {
      totalMilestones,
      completedMilestones,
      activeMilestones,
      inProgressMilestones,
      pausedMilestones,
    };
}


async getProjectMilestoneAndTaskStats(projectId: string) {
  // Get all milestones for the project
  const milestones = await this.prisma.milestone.findMany({
    where: { projectId },
    select: { id: true },
  });

  const milestoneIds = milestones.map(m => m.id);

  const totalMilestones = milestones.length;

  // Get total tasks under those milestones
  const totalTasks = await this.prisma.task.count({
    where: {
      milestoneId: { in: milestoneIds },
    },
  });

  // Get completed tasks under those milestones
  const completedTasks = await this.prisma.task.count({
    where: {
      milestoneId: { in: milestoneIds },
      status: "done",
    },
  });

  return {
    totalMilestones,
    totalTasks,
    completedTasks,
  };
}

}



  
  
