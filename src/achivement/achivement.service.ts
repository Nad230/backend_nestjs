import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAchievementDto } from './dto/update-achivement.dto';
@Injectable()
export class AchivementService {
  constructor(private prisma: PrismaService) {}


  async markAchievementAsShown(userId: string, achievementId: string) {
    await this.prisma.$executeRaw`
      UPDATE "_UserAchievements"
      SET "showed" = true
      WHERE "B" = ${userId} AND "A" = ${achievementId};
    `;
    console.log(`✅ Marked achievement ${achievementId} as shown for user ${userId}`);
  }
  
  async getAchievementShowedStatus(userId: string, achievementId: string) {
    const result = await this.prisma.$queryRaw<{ showed: boolean }[]>`
      SELECT "showed"
      FROM "_UserAchievements"
      WHERE "B" = ${userId} AND "A" = ${achievementId};
    `;
  
    if (!result || result.length === 0) {
      console.log(`❌ No record found for user ${userId} and achievement ${achievementId}`);
      return { showed: null }; // Ensure the response is always an object
    }
  
    console.log(`✅ Achievement ${achievementId} for user ${userId} has showed = ${result[0].showed}`);
    return { showed: result[0].showed }; // Return as an object
  }
  
  

  async checkProjectAchievements(userId: string) {
    const projects = await this.prisma.project.count({ where: { userId } });
    console.log(`User ${userId} has ${projects} projects`); // Debug log

    if (projects === 1) {  
      console.log(`Assigning achievement: First Project Created`);
      await this.assignAchievement(userId, 'First Project Created');
  }
  if (projects === 10) {  
      console.log(`Assigning achievement: 10 Projects Managed`);
      await this.assignAchievement(userId, '10 Projects Managed');
  }
  
}


  async checkCompletedProjectAchievements(userId: string) {
    // Count projects that have been completed
    const completedProjects = await this.prisma.project.count({
      where: {
        userId,
        completedAt: { not: null }, // Check if the project has a completion date
      },
    });
  
    if (completedProjects === 1) {
      await this.assignAchievement(userId, 'Successfully Completed a Project');
    }
  
    if (completedProjects === 5) {
      await this.assignAchievement(userId, 'Completed 5 Projects');
    }
  
    if (completedProjects === 10) {
      await this.assignAchievement(userId, 'Completed 10 Projects');
    }
  }
  
  

  async checkTaskAchievements(userId: string) {
    const tasks = await this.prisma.task.count({ where: { assignedToId: userId, status: 'COMPLETED' } });
    
    if (tasks === 1) {
      await this.assignAchievement(userId, 'First Task Completed');
    }
    if (tasks === 100) {
      await this.assignAchievement(userId, '100 Tasks Completed');
    }
  }

  async checkMilestoneAchievements(userId: string) {
    const milestones = await this.prisma.milestone.count({
      where: {
        project: { userId }, // Traverse through project to find milestones
      },
    });
  
    if (milestones === 1) {
      await this.assignAchievement(userId, 'First Milestone Reached');
    }
  }
  
  

  async assignAchievement(userId: string, achievementName: string) {
    console.log(`Checking achievement: ${achievementName} for user: ${userId}`);
  
    const achievement = await this.prisma.achievement.findFirst({
      where: { name: achievementName },
    });
  
    if (!achievement) {
      console.log(`Achievement ${achievementName} not found in database!`);
      return;
    }
  
    console.log(`Assigning achievement ${achievementName} with ID ${achievement.id}`);
  
    // Insert into the correct many-to-many join table `_UserAchievements`
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        achievements: {
          connect: { id: achievement.id }, // Connect the achievement to the user
        },
      },
    });
  
    console.log(`Successfully assigned achievement ${achievementName} to ${userId}`);
  }
  

  async getAllAchievements() {
    return this.prisma.achievement.findMany();
  }
  
  async getAchievementById(id: string) {
    return this.prisma.achievement.findUnique({
      where: { id },
    });
  }
  async getUserAchievements(userId: string) {
      console.log("🟡 DEBUG: Fetching achievements for user", userId);
    
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { achievements: true }, // ✅ Ensure it includes the relation
      });
    
      if (!user) {
        throw new Error(`❌ User with ID ${userId} not found!`);
      }
    
      if (!user.achievements.length) {
        throw new Error(`❌ No achievements linked to User ID: ${userId}`);
      }
    
      console.log(`✅ Achievements for ${userId}:`, user.achievements);
      return user.achievements;
    }
    
}

  
  
  


