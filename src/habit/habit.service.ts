import { Injectable, NotFoundException } from "@nestjs/common"
import  { HabitDto } from "./dto/habit.dto"
import { HabitStatus,  HabitType, BadgeType } from "@prisma/client"
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HabitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: HabitDto) {
    if (!userId) {
      throw new Error("User ID is missing in request.")
    }

    // Utiliser 'id_users' pour la recherche
    const user = await this.prisma.user.findUnique({
      where: { id_users: userId },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`)
    }

    // Vérifier si l'objectif existe si goalId est fourni
    if (data.goalId) {
      const goal = await this.prisma.goal.findUnique({
        where: { id: data.goalId },
      })

      if (!goal) {
        throw new NotFoundException(`Goal with ID ${data.goalId} not found.`)
      }

      if (goal.userId !== userId) {
        throw new Error("Goal does not belong to this user.")
      }
    }

    return this.prisma.habit.create({
      data: {
        userId: user.id_users,
        name: data.name,
        description: data.description,
        type: data.type as HabitType,
        weeklyTarget: data.weeklyTarget ?? 0,
        status: data.status ?? HabitStatus.NotStarted,
        goalId: data.goalId,
      },
    })
  }

  async findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
      include: {
        completions: {
          orderBy: { date: "desc" },
          take: 7,
        },
        goal: true,
        badges: true,
      },
    })
  }

  async findOne(id: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id },
      include: {
        completions: {
          orderBy: { date: "desc" },
          take: 30,
        },
        goal: true,
        badges: true,
      },
    })

    if (!habit) throw new NotFoundException(`Habit with ID ${id} not found`)
    return habit
  }

  async update(id: string, data: HabitDto) {
    const habit = await this.prisma.habit.findUnique({ where: { id } })
    if (!habit) throw new NotFoundException(`Habit with ID ${id} not found`)

    // Vérifier si l'objectif existe si goalId est fourni
    if (data.goalId) {
      const goal = await this.prisma.goal.findUnique({
        where: { id: data.goalId },
      })

      if (!goal) {
        throw new NotFoundException(`Goal with ID ${data.goalId} not found.`)
      }

      if (goal.userId !== habit.userId) {
        throw new Error("Goal does not belong to this user.")
      }
    }

    return this.prisma.habit.update({
      where: { id },
      data,
    })
  }

  async updateStatus(id: string, status: HabitStatus) {
    const habit = await this.prisma.habit.findUnique({ where: { id } })
    if (!habit) throw new NotFoundException(`Habit with ID ${id} not found`)

    return this.prisma.habit.update({
      where: { id },
      data: { status },
    })
  }

  async recordCompletion(id: string, completed: boolean, notes?: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id },
      include: { completions: true, badges: true },
    })
    if (!habit) throw new NotFoundException(`Habit with ID ${id} not found`)

    // Create completion record
    const completion = await this.prisma.habitCompletion.create({
      data: {
        habitId: id,
        completed,
        notes,
      },
    })

    // Update streak if completed
    let streak = habit.streak
    if (completed) {
      streak += 1

      // Check for streak badges
      if (streak === 7) {
        await this.prisma.badge.create({
          data: {
            habitId: id,
            type: BadgeType.Streak,
            name: "Week Warrior",
            description: "Completed habit for 7 consecutive days",
          },
        })
      } else if (streak === 30) {
        await this.prisma.badge.create({
          data: {
            habitId: id,
            type: BadgeType.Streak,
            name: "Monthly Master",
            description: "Completed habit for 30 consecutive days",
          },
        })
      } else if (streak === 100) {
        await this.prisma.badge.create({
          data: {
            habitId: id,
            type: BadgeType.Streak,
            name: "Century Champion",
            description: "Completed habit for 100 consecutive days",
          },
        })
      }

      // Check for consistency badges
      const totalCompletions = habit.completions.filter((c) => c.completed).length + 1
      if (totalCompletions === 10) {
        await this.prisma.badge.create({
          data: {
            habitId: id,
            type: BadgeType.Consistency,
            name: "Dedicated Beginner",
            description: "Completed habit 10 times",
          },
        })
      } else if (totalCompletions === 50) {
        await this.prisma.badge.create({
          data: {
            habitId: id,
            type: BadgeType.Consistency,
            name: "Habit Enthusiast",
            description: "Completed habit 50 times",
          },
        })
      }
    } else {
      streak = 0 // Reset streak on missed day
    }

    // Update habit
    await this.prisma.habit.update({
      where: { id },
      data: {
        streak,
        status: HabitStatus.InProgress, // Automatically set to in progress when tracking
      },
    })

    return completion
  }

  async resetHabit(id: string) {
    const habit = await this.prisma.habit.findUnique({ where: { id } })
    if (!habit) throw new NotFoundException(`Habit with ID ${id} not found`)

    // Delete all completions for this habit
    await this.prisma.habitCompletion.deleteMany({
      where: { habitId: id },
    })

    // Reset the habit: streak to 0, status to InProgress, and update the timestamp
    const now = new Date()
    return this.prisma.habit.update({
      where: { id },
      data: {
        streak: 0,
        status: HabitStatus.InProgress,
        updatedAt: now, // This will be used as the new week start date
      },
    })
  }

  async remove(id: string) {
    const habit = await this.prisma.habit.findUnique({ where: { id } })
    if (!habit) throw new NotFoundException(`Habit with ID ${id} not found`)

    // Delete all completions and badges first
    await this.prisma.habitCompletion.deleteMany({
      where: { habitId: id },
    })

    await this.prisma.badge.deleteMany({
      where: { habitId: id },
    })

    // Then delete the habit
    return this.prisma.habit.delete({ where: { id } })
  }
  // habit.service.ts
async getWeeklyHabitData(userId: string): Promise<any> {
  // Replace this with your actual logic to fetch habit data from the past 7 days
  return await this.prisma.habit.findMany({
    where: {
      userId: userId,
      // Adjust this depending on how your habit tracking data is stored
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // past 7 days
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

}
