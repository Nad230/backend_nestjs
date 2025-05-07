import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService) {}
    async create(userId: string, data: CreateTeamDto) {
        if (!userId) {
            throw new Error('User ID is missing in request.');
        }
    
        // Validate if the owner exists
        const owner = await this.prisma.user.findUnique({
            where: { id: userId },
        });
    
        if (!owner) {
            throw new Error('Owner does not exist.');
        }
    
        // Ensure TeamMembers is always an array
        const teamMembers = Array.isArray(data.TeamMembers) ? data.TeamMembers : [];
    
        // Validate members
        const existingUsers = await this.prisma.user.findMany({
            where: {
                id: { in: teamMembers },
            },
            select: { id: true },
        });
    
        const existingUserIds = new Set(existingUsers.map(user => user.id));
    
        // Filter out invalid users
        const validMembers = teamMembers.filter(memberId => existingUserIds.has(memberId));
        const invalidMembers = teamMembers.filter(memberId => !existingUserIds.has(memberId));
    
        if (invalidMembers.length > 0) {
            throw new Error(`Some users do not exist: ${invalidMembers.join(', ')}`);
        }
    
        // Create the team first
        const team = await this.prisma.team.create({
            data: {
                name: data.name,
                description: data.description,
                ownerId: userId,
                projects: {
                    connect: { id: data.projectId },
                },
                updatedAt: new Date(),
            },
        });
    
        // Now, add the members
        if (validMembers.length > 0) {
            await this.prisma.teamMember.createMany({
                data: validMembers.map((memberId: string) => ({
                    userId: memberId,
                    teamId: team.id,
                    role: 'member', // Default role
                })),
            });
        }
    
        // Return the team with members included
        return this.prisma.team.findUnique({
            where: { id: team.id },
            include: {
                members: {
                  include: {
                    user: true // Include user details
                  }
                },
                projects: true,
            },
        });
    }
    
    
    async addTeamMember(teamId: string, userId: string, role: string = 'member') {
      // Check if the user is already a member of the team
      const existingMember = await this.prisma.teamMember.findUnique({
          where: {
              userId_teamId: { userId, teamId },
          },
      });
  
      if (existingMember) {
          throw new Error('User is already a member of this team.');
      }
  
      // If not, add the user to the team
      return this.prisma.teamMember.create({
          data: {
              teamId,
              userId,
              role,
          },
      });
  }
  

    async removeTeamMember(teamId: string, userId: string) {
        return this.prisma.teamMember.deleteMany({
            where: {
                teamId,
                userId,
            },
        });
    }

    async updateTeam(teamId: string, data: Partial<CreateTeamDto>) {
        return this.prisma.team.update({
            where: { id: teamId },
            data: {
                name: data.name,
                description: data.description,
                updatedAt: new Date(),
            },
        });
    }

    async deleteTeam(teamId: string) {
        return this.prisma.team.delete({
            where: { id: teamId },
        });
    }
    async getAllTeamMembers(teamId: string) {
      return this.prisma.teamMember.findMany({
          where: { teamId },
          include: { user: true }, // Include user details
      });
  }
  async getActiveTeamMembers(teamId: string) {
  const activeMembers = await this.prisma.teamMember.findMany({
    where: {
      teamId,
      status: 'ACTIVE', // Assuming there's a status field that determines active members
    },
    include: { user: true }, // Include user details
  });

  return {
    count: activeMembers.length,
    members: activeMembers,
  };
}

  async getTeamMemberById(teamId: string, memberId: string) {
    const member = await this.prisma.teamMember.findFirst({
        where: {
            teamId, 
            userId: memberId, // ✅ Ensure you're checking the correct field
        },
        include: { user: true, tasks: true, milestones: true }, // ✅ Include user details if needed
    });

    if (!member) {
        throw new NotFoundException('Team member not found');
    }

    return member;
}



  // ✅ Get all teams for a specific user
  async getTeamsForUser(userId: string) {
      return this.prisma.team.findMany({
          where: {
              members: {
                  some: { userId },
              },
          },
          include: { members: true, projects: true },
      });
  }

  // ✅ Get a specific team by ID
  async getTeamById(teamId: string) {
      return this.prisma.team.findUnique({
          where: { id: teamId },
          include: { members: true, projects: true },
      });
  }
}
