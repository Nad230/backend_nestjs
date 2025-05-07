import { Module } from '@nestjs/common';
import { CitationService } from './citation.service';
import { CitationController } from './citation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [CitationService, PrismaService],
  controllers: [CitationController],
  imports: [AuthModule], 
  
})
export class CitationModule {}
