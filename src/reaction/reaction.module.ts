import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [ReactionController],
  providers: [ReactionService],
  imports: [AuthModule,PrismaModule], 

})
export class ReactionModule {}