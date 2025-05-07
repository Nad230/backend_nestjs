import { Module } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { TimeEntryController } from './time-entry.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AuthModule,PrismaModule], 
  controllers: [TimeEntryController],
  providers: [TimeEntryService],
})
export class TimeEntryModule {}
