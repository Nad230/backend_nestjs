import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { endOfDay, startOfDay } from 'date-fns';
import { Sale } from '@prisma/client';
import { CreateDailyProfitDto } from './dto/create-daily-profit.dto';

const results: Sale[] = [];

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto, userId: string) {
    const { productId, ...rest } = createSaleDto;

    // Optional: validate product ownership
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.userId !== userId) {
      throw new Error('Unauthorized to add sale to this product');
    }

    return this.prisma.sale.create({
      data: {
        ...rest,
        productId,
        userId,
      },
    });
  }


  async createMany(sales: CreateSaleDto[], userId: string) {
    const productIds = sales.map((sale) => sale.productId);
  
    const ownedProducts = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        userId,
      },
      select: { id: true },
    });
  
    const validIds = new Set(ownedProducts.map(p => p.id));
  
    for (const sale of sales) {
      if (!validIds.has(sale.productId)) {
        throw new Error(`You are not allowed to create sale for product ${sale.productId}`);
      }
    }
  
    const results: Sale[] = []; // ✅ Fix is here
  
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
  
    for (const sale of sales) {
      const existingSale = await this.prisma.sale.findFirst({
        where: {
          userId,
          productId: sale.productId,
          date: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });
  
      if (existingSale) {
        const updated = await this.prisma.sale.update({
          where: {
            id: existingSale.id,
          },
          data: {
            quantity: existingSale.quantity + sale.quantity,
          },
        });
        results.push(updated);
      } else {
        const created = await this.prisma.sale.create({
          data: {
            ...sale,
            userId,
            date: new Date(),
          },
        });
        results.push(created);
      }
    }
  
    return results;
  }
  

  async update(id: string, updateSaleDto: UpdateSaleDto, userId: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
    });

    if (!sale || sale.userId !== userId) {
      throw new Error('Unauthorized or not found');
    }

    return this.prisma.sale.update({
      where: { id },
      data: updateSaleDto,
    });
  }

  async findAllByUser(userId: string) {
  return this.prisma.sale.findMany({
    where: { userId },
    include: { product: true }, // Optional: join product details
    orderBy: { date: 'desc' },
  });
}
async getTodayTotal(userId: string): Promise<number> {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
  
    const sales = await this.prisma.sale.findMany({
      where: {
        userId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        product: {
          select: {
            price: true,
          },
        },
      },
    });
  
    const total = sales.reduce((sum, sale) => {
      return sum + (sale.product.price * sale.quantity);
    }, 0);
  
    return total;
  }

  // daily-profit.service.ts
async createProfit(dto: CreateDailyProfitDto,userId:string) {
  return this.prisma.dailyProfit.create({
    data: {
      userId: userId,
      date: dto.date,
      day:dto.day,
      revenue: dto.revenue,
      expenses: dto.expenses,
      timeWorked:dto.timeWorked,
      profit: dto.profit,
    },
  });
}


  /******************************************************************************************** */



}
