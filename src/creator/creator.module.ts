import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule,AuthModule,PrismaModule,ScheduleModule.forRoot(),
  ], 
  providers: [CreatorService,PrismaService],
  controllers: [CreatorController]
})
export class CreatorModule {}
