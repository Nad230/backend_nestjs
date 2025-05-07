import { Module } from '@nestjs/common';
import { ProjectOfflineAiService } from './project-offline-ai.service';
import { ProjectOfflineAiController } from './project-offline-ai.controller';
import { SaleService } from 'src/sale/sale.service';
import { ExpensesService } from 'src/expenses/expenses.service';
import { TimeEntryService } from 'src/time-entry/time-entry.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserlocationService } from 'src/userlocation/userlocation.service';
import { BusinessPlanService } from 'src/business-plan/business-plan.service';

@Module({
  providers: [ProjectOfflineAiService,SaleService,ExpensesService,TimeEntryService,UserlocationService,BusinessPlanService],
  controllers: [ProjectOfflineAiController],
  imports: [AuthModule,PrismaModule], 
})
export class ProjectOfflineAiModule {}
