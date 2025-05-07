import { Module } from '@nestjs/common';
import { AchivementService } from './achivement.service';
import { AchivementController } from './achivement.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
      imports: [AuthModule], 
  
  providers: [AchivementService,PrismaService],
  controllers: [AchivementController],
  
})
export class AchivementModule {}
