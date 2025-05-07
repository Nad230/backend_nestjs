import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { AIService } from 'src/ai/ai.service';
import { AchivementService } from 'src/achivement/achivement.service';

@Module({
  imports: [AuthModule], 
  controllers: [ProjectController],
 
  providers: [ProjectService, PrismaService,AchivementService],
})
export class ProjectModule {}
