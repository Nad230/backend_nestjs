import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RepeatExpenseProcessor {
  private readonly logger = new Logger(RepeatExpenseProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRepeatExpenses() {
    const today = new Date();
    const allRepeats = await this.prisma.expense.findMany({
      where: {
        repeat: true,
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });

    for (const expense of allRepeats) {
      const shouldAdd = await this.shouldCreateToday(expense, today);
      if (shouldAdd) {
        await this.prisma.expense.create({
          data: {
            title: expense.title,
            amount: expense.amount,
            type: expense.type,
            date: today,
            userId: expense.userId,
            repeat: false,
          },
        });

        this.logger.log(`Created repeating expense for ${expense.title}`);
      }
    }
  }

  private async shouldCreateToday(expense: any, today: Date): Promise<boolean> {
    const existing = await this.prisma.expense.findFirst({
      where: {
        userId: expense.userId,
        title: expense.title,
        date: today,
        repeat: false,
      },
    });

    if (existing) return false;

    const expDate = new Date(expense.date);
    const sameDay = expDate.getDate() === today.getDate();
    const sameMonth = expDate.getMonth() === today.getMonth();
    const sameYear = expDate.getFullYear() === today.getFullYear();

    switch (expense.repeatType) {
      case 'daily':
        return true;
      case 'monthly':
        return sameDay;
      case 'yearly':
        return sameDay && sameMonth;
      default:
        return false;
    }
  }
  // TEMP ONLY — for manual testing
async runNowForTesting() {
    await this.handleRepeatExpenses();
  }
  
}

