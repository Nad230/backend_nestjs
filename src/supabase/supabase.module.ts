import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService], // ✅ This allows other modules to use it
  imports: [ConfigModule], // ✅ Import ConfigModule here

})
export class SupabaseModule {}
