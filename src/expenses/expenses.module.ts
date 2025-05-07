import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RepeatExpenseProcessor } from './repeat-expense.processor';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService,RepeatExpenseProcessor],
    imports: [AuthModule,PrismaModule], 
  
  
})
export class ExpensesModule {}
