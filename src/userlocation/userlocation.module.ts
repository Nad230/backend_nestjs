import { Module } from '@nestjs/common';
import { UserlocationService } from './userlocation.service';
import { UserlocationController } from './userlocation.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[AuthModule,PrismaModule],
  providers: [UserlocationService],
  controllers: [UserlocationController]
})
export class UserlocationModule {}
