import { Module } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { ProfitController } from './profit.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ProfitService],
  controllers: [ProfitController],
        imports: [AuthModule,PrismaModule], 
  
})
export class ProfitModule {}
