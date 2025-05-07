// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [PostController],
  providers: [PostService], 
  imports: [AuthModule,PrismaModule], 

})
export class PostModule {}