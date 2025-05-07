import { Module } from "@nestjs/common";
import { AIService } from "./ai.service";
import { AuthModule } from "src/auth/auth.module";
import { TaskService } from "src/task/task.service";
import { MilestoneService } from "src/milestone/milestone.service";
import { ProjectService } from "src/project/project.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AchivementService } from "src/achivement/achivement.service";

@Module({
  imports: [AuthModule], 
  providers: [AIService,TaskService,MilestoneService,ProjectService,PrismaService,AchivementService],
  exports: [AIService], // Export so you can use it in controllers
})
export class AIModule {}
