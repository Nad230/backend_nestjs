import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { TeamController } from './team.controller';

@Module({
  imports: [AuthModule], 
  providers: [TeamService,PrismaService],
  controllers: [TeamController]
})
export class TeamModule {}


