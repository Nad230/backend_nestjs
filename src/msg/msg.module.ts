import { Module } from '@nestjs/common';
import { MessagesService } from './msg.service';
import { MessagesController } from './msg.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [MulterModule.register({ dest: './uploads' }),AuthModule,PrismaModule,SupabaseModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],

})
export class MessageModule {}