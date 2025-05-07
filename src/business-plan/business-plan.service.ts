import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBusinessPlanDto } from './dto/create-business-plan.dto';
import { CreatebusinessplanDto } from './dto/createplanBusiness.dto';
export interface PlanOverview {
  title: string;
  budget: number;
  description: string;
}
@Injectable()
export class BusinessPlanService {


    constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBusinessPlanDto,userId:string) {
    return this.prisma.businessPlan.create({
      data: {
        userId: userId,
        UserLocationId: data.UserLocationId,
        title: data.title,
        description: data.description,
        whyItFits: data.whyItFits,
        bonusTip: data.bonusTip,
        difficulty: data.difficulty,
        timeToProfit: data.timeToProfit,
        estimatedCost: data.estimatedCost,
        status: data.status ?? 'DRAFT',
      },
    });
}




async getByUserId(userId: string) {
  return this.prisma.businessPlan.findMany({
    where: {
      userId: userId,
    },
  });
}

async getByBusinessId(id: string) {
  return this.prisma.businessPlan.findUnique({
    where: {
      id: id,
    },
  });
}




// startupPlan.service.ts
async getStartupPlansByUserId(userId: string) {
  return this.prisma.startupPlan.findMany({
    where: { userId },
    include: {
      budgetItems: true,
      tips: true,
      risks: true,
      calendarWeeks: true,
      AiPlanTask: true,
      UserExpense: true,
      user: true,
      aiJob: true,
    },
  });
}
async getTaskStartupPlansByUserId(userId: string) {
  return this.prisma.startupPlan.findMany({
    where: { userId },
    include: {
      AiPlanTask: true,
   
    },
  });
}
/***************************************************************************** */
async getPlansByUser(userId: string): Promise<PlanOverview[]> {
  const plans = await this.prisma.startupPlan.findMany({
    where: { userId },
    select: {
      id:true,
      title: true,
      budget: true,
      aiJob: {
        select: {
          description: true
        }
      }
    }
  });

  return plans.map(plan => ({
    id:plan.id,
    title: plan.title,
    budget: plan.budget,
    description: plan.aiJob?.description ?? ''
  }));
}
/********************************************************************************************************************* */

async getAiPlanTasksByStartupPlanId(startupPlanId: string) {
  return await this.prisma.aiPlanTask.findMany({
    where: { startupPlanId },
    select: {
      id: true,
      dayNumber: true,
      title: true,
      description: true,
      completed: true,
      plannedDate: true,
    },
    orderBy: {
      dayNumber: 'asc',
    },
  });
}async getFirstIncompleteAiPlanTask(startupPlanId: string) {
  const tasks = await this.prisma.aiPlanTask.findMany({
    where: {
      startupPlanId,
    },
    select: {
      id: true,
      dayNumber: true,
      title: true,
      description: true,
      completed: true,
      plannedDate: true,
    },
  });

  // Helper to extract first number or return a high default value if invalid
  const getFirstNumber = (s: string | null) => {
    const match = s?.match(/\d+/);
    return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
  };

  // Sort manually using the parsed number
  tasks.sort((a, b) => getFirstNumber(a.dayNumber) - getFirstNumber(b.dayNumber));

  // Return the first incomplete task
  return tasks.find(task => task.completed === false) || null;
}

async getAiPlanProgress(startupPlanId: string) {
  const tasks = await this.prisma.aiPlanTask.findMany({
    where: { startupPlanId },
    select: { completed: true },
  });

  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;

  const progress = total === 0 ? 0 : (completed / total) * 100;

  return {
    totalTasks: total,
    completedTasks: completed,
    progressPercentage: Math.round(progress),
  };
}


async updateAiPlanTaskCompleted(taskId: string, completed: boolean) {
  return await this.prisma.aiPlanTask.update({
    where: { id: taskId },
    data: { completed },
    select: {
      id: true,
      completed: true,
    },
  });
}



async getCalendarWeeksByStartupPlanId(startupPlanId: string) {
  return await this.prisma.calendarWeek.findMany({
    where: { startupPlanId },
    select: {
      id: true,
      weekNumber: true,
      summary: true,
    },
    orderBy: {
      weekNumber: 'asc',
    },
  });
}


async getRisksByStartupPlanId(startupPlanId: string) {
  return await this.prisma.risk.findMany({
    where: { startupPlanId },
    select: {
      id: true,
      risk: true,
      mitigation: true,
    },
  });
}

async getTipsByStartupPlanId(startupPlanId: string) {
  try {
    return await this.prisma.tip.findMany({
      where: { startupPlanId },
      select: {
        id: true,
        content: true,
      },
    });
  } catch (error) {
    console.error('Error fetching tips:', error);
    throw new InternalServerErrorException('Failed to load tips');
  }
}

async getUserExpensesByStartupPlanId(startupPlanId: string) {
  return await this.prisma.userExpense.findMany({
    where: { startupPlanId },
    select: {
      id: true,
      title: true,
      amount: true,
      date: true,
      notes: true,
      taskId: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}
async getBudgetItemsByStartupPlanId(startupPlanId: string) {
  return await this.prisma.budgetItem.findMany({
    where: { startupPlanId },
    select: {
      id: true,
      name: true,
      suggestedCost: true,
      actualCost: true,
      notes: true,
    },
  });
}









/***************************************************************************** */

async  createLocalUserBusinessplan(data: CreatebusinessplanDto,userId:string) {
  try {
    const newBusinessPlan = await this.prisma.localUserBusinessplan.create({
      data: {
        projectName: data.projectName,
        userId: userId,
        projectType: data.projectType,
        city: data.city,
        country: data.country,
        description: data.description,
        BudgetRange: data.BudgetRange,
      },
    });

    return newBusinessPlan;
  } catch (error) {
    console.error('Error creating business plan:', error);
    throw error;
  }
}


// service: local-user-businessplan.service.ts

// Get BudgetRange by userId
async getBudgetRangeByUserId(userId: string) {
  const plan = await this.prisma.localUserBusinessplan.findFirst({
    where: { userId },
    select: { BudgetRange: true },
  });
  return plan?.BudgetRange ?? null;
}

// Get country by userId
async getCountryByUserId(userId: string) {
  const plan = await this.prisma.localUserBusinessplan.findFirst({
    where: { userId },
    select: { country: true },
  });
  return plan?.country ?? null;
}

// Get city by userId
async getCityByUserId(userId: string) {
  const plan = await this.prisma.localUserBusinessplan.findFirst({
    where: { userId },
    select: { city: true },
  });
  return plan?.city ?? null;
}

// Get description and projectName by userId
async getDescriptionAndTitleByUserId(userId: string) {
  const plan = await this.prisma.localUserBusinessplan.findFirst({
    where: { userId },
    select: {
      id:true,
      description: true,
      projectName: true,
      projectType:true,
    },
  });
  return plan ?? null;
}


}