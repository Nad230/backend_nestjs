import { Module } from '@nestjs/common';
import { BusinessPlanController } from './business-plan.controller';
import { BusinessPlanService } from './business-plan.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BusinessPlanController],
  providers: [BusinessPlanService],
  imports:[AuthModule,PrismaModule]
})
export class BusinessPlanModule {}
