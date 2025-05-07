import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class TimeEntryService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateTimeEntryDto) {
    return this.prisma.timeEntry.create({
      data: {
        userId,
        projectId: data.projectId,
        taskId: data.taskId,
        teamId: data.teamId, // Allow team tracking
        notes: data.notes,
        startTime: new Date(),
        endTime: data.endTime,  // Ensure Prisma accepts the required field

        status: 'in-progress', // Default status
      },
    });
  }

  async getAll(userId: string) {
    return this.prisma.timeEntry.findMany({
      where: { userId },
      include: {
        project: true,
        task: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }

  async stopTimer(timeEntryId: string) {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id: timeEntryId },
    });
  
    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }
  
    // Ensure startTime is a valid Date
    if (!timeEntry.startTime) {
      throw new Error("Start time is missing for this time entry.");
    }
  
    // Ensure endTime is a valid Date (set to current time if not provided)
    const endTime = new Date(); 
  
    // Convert time difference from milliseconds to hours (rounded to 2 decimals)
    const duration = Math.round(((endTime.getTime() - new Date(timeEntry.startTime).getTime()) / (1000 * 60 * 60)) * 100) / 100;
  
    return this.prisma.timeEntry.update({
      where: { id: timeEntryId },
      data: { endTime, duration, status: 'completed' },
    });
  }
  
  async countTrackedProjects(userId: string): Promise<number> {
    const uniqueProjects = await this.prisma.timeEntry.findMany({
      where: { userId },
      select: { projectId: true },
      distinct: ['projectId'],
    });

    return uniqueProjects.length;
  }

  async getTimeStats(userId: string) {
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayTotal = await this.getTotalTime(userId, startOfToday, now);
    const weeklyTotal = await this.getTotalTime(userId, startOfWeek, now);
    const monthlyTotal = await this.getTotalTime(userId, startOfMonth, now);

    const projectsTracked = await this.countTrackedProjects(userId);

    return {
      today: todayTotal,
      weekly: weeklyTotal,
      monthly: monthlyTotal,
      projectsTracked,
    };
  }

  private async getTotalTime(userId: string, startDate: Date, endDate: Date) {
    const result = await this.prisma.timeEntry.aggregate({
      _sum: { duration: true },
      where: {
        userId,
        startTime: { gte: startDate, lte: endDate },
      },
    });

    return result._sum.duration || 0;
  }

  async appendNote(id: string, newNote: string, userId: string) {
    const existing = await this.prisma.timeEntry.findUnique({
      where: { id },
      select: {
        notes: true,
        userId: true,
      }
    })
  
    if (!existing) {
      throw new NotFoundException('Time entry not found')
    }
  
   
  
    const updatedNote = [existing.notes, newNote].filter(Boolean).join('\n')
  
    return this.prisma.timeEntry.update({
      where: { id },
      data: { notes: updatedNote }
    })
  }
  


  async getTodayTotalDuration(userId: string): Promise<number> {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
  
    const entries = await this.prisma.timeEntry.findMany({
      where: {
        userId,
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      select: {
        duration: true,
      },
    });
  
    const totalDuration = entries.reduce((sum, entry) => {
      return sum + (entry.duration || 0);
    }, 0);
  
    return totalDuration; // You can divide by 60 if you want it in hours instead of minutes
  }
  

}