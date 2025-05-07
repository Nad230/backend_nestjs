import { Module } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchivementService } from 'src/achivement/achivement.service';

@Module({
    imports: [AuthModule], 
  providers: [MilestoneService,PrismaService,AchivementService],
  controllers: [MilestoneController]
})
export class MilestoneModule {}
