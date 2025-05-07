import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [AuthModule,PrismaModule], 

})
export class CommentModule {}