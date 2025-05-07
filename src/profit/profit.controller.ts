import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('profit')
export class ProfitController {


    constructor(private readonly profitService: ProfitService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createProfit(
        @Request()req,
      @Body() body: { amount: number;  invoiceId?: string; productId?: string }
    ) {
      return this.profitService.createProfit(body,req.user.sub);
    }
}
