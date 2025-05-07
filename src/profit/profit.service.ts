import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfitService {
  constructor(private prisma: PrismaService) {}





    async createProfit(data: {
        amount: number;
        invoiceId?: string;
        productId?: string;
      },userId:string) {
        return this.prisma.profit.create({
          data: {
            amount: data.amount,
            userId: userId,
            invoiceId: data.invoiceId,
            productId: data.productId,
          },
        });
      }
      
}
