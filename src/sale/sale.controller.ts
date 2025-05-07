import { Controller, Post, Body, Patch, Param, UseGuards, Request, Get } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDailyProfitDto } from './dto/create-daily-profit.dto';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    const userId = req.user.sub;
    return this.saleService.create(createSaleDto, userId);
  }
  @Post('profit')
  createProfit(@Body() createSaleDto: CreateDailyProfitDto, @Request() req) {
    const userId = req.user.sub;
    return this.saleService.createProfit(createSaleDto, userId);
  }

  @Post('batch')
createMany(@Body() sales: CreateSaleDto[], @Request() req) {
  const userId = req.user.sub;
  return this.saleService.createMany(sales, userId);
}
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto, @Request() req) {
    const userId = req.user.sub;
    return this.saleService.update(id, updateSaleDto, userId);
  }

  @Get()
findAll(@Request() req) {
  const userId = req.user.sub;
  return this.saleService.findAllByUser(userId);
}
@Get('todayTotal')
findtoday(@Request() req) {
  const userId = req.user.sub;
  return this.saleService.getTodayTotal(userId);

}






}
