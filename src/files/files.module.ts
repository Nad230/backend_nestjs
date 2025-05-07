import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseModule } from 'src/supabase/supabase.module'; // ✅ Import SupabaseModule
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SupabaseModule,AuthModule], // ✅ Make SupabaseService available
  providers: [FilesService, PrismaService], 
  controllers: [FilesController],
})
export class FilesModule {} 
