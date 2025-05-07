
import {
    Body,
    Controller,
    Post,
    UseGuards,
    Request,
    Param,
    Get,
    Patch,
    Delete,
  } from '@nestjs/common';
  
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { CreateExpenseDto } from './dto/create-expense.dto';
  import { ExpensesService } from './expenses.service';
@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expenseService: ExpensesService) {}


    @UseGuards(JwtAuthGuard)
  @Get('total')
  getTotalExpenseUserId(@Request() req) {
    return this.expenseService.getTotalExpenseAmountByUser(req.user.sub);
  }
    @UseGuards(JwtAuthGuard)
  @Get('today')
  getExpenseUserId(@Request() req) {
    return this.expenseService.getTodayTotalExpense(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(dto, req.user.sub);
  }

  @Get()
  getAll() {
    return this.expenseService.getAllExpenses();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.expenseService.getExpenseById(id);
  }

  @Get()
  getByUserId(@Request() req) {
    return this.expenseService.getExpensesByUserId(req.user.sub);
  }
  






}


