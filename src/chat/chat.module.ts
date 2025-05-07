import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
      imports: [AuthModule,PrismaModule], 
  
})
export class ChatModule {}