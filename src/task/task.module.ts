import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AchivementService } from 'src/achivement/achivement.service';

@Module({
  imports: [AuthModule], 
  controllers: [TaskController],
  providers: [TaskService, PrismaService,AchivementService]
})
export class TaskModule {}
