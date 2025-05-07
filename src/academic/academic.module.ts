import { Module } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AcademicService,PrismaService],
  controllers: [AcademicController],
    imports: [AuthModule], 
})
export class AcademicModule {}
