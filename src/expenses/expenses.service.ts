import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class ExpensesService {
    constructor(private prisma: PrismaService) {}
    async createExpense(dto: CreateExpenseDto, userId: string) {
        // Handle non-repeating expense
        if (!dto.repeat) {
          return this.prisma.expense.create({
            data: {
              title: dto.title,
              amount: dto.amount,
              type: dto.type,
              date: new Date(dto.date),
              userId,
              ...(dto.startDate && { startDate: new Date(dto.startDate) }),
              ...(dto.endDate && { endDate: new Date(dto.endDate) }),
            },
          });
        }
      
        // Handle repeating expense
        if (!dto.startDate || !dto.endDate || !dto.repeatType) {
          throw new Error('Repeating expenses require startDate, endDate, and repeatType');
        }
      
        return this.prisma.expense.create({
          data: {
            title: dto.title,
            amount: dto.amount,
            type: dto.type,
            date: new Date(dto.startDate), // first instance
            userId,
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
            repeat: true,
            repeatType: dto.repeatType,
          },
        });
      }


      async getTotalExpenseAmountByUser(userId: string) {
        const result = await this.prisma.expense.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            userId,
          },
        });
      
        return {
          totalAmount: result._sum.amount || 0,
        };
      }
      
      
  async getAllExpenses() {
    return this.prisma.expense.findMany();
  }

  async getExpenseById(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async getExpensesByUserId(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
    });
  }

  async getTodayTotalExpense(userId: string): Promise<number> {
    const todayStart = startOfDay(new Date());
    const todayEnd   = endOfDay(new Date());

    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
  
    
    // sum up amounts, or 0 if none
    const total= expenses.reduce((sum, e) => sum + e.amount, 0);
    return total;

  }

    
}
