
import { Module } from '@nestjs/common';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';
import { WeeklySummaryService } from './weekly-summary.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  // Import PrismaModule here
  controllers: [HabitController],
  providers: [HabitService ,WeeklySummaryService],
  exports: [HabitService ,WeeklySummaryService],
  imports: [AuthModule,PrismaModule], 

})
export class HabitModule {}