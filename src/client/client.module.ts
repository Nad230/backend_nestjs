import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ClientService],
  controllers: [ClientController],
      imports: [AuthModule,PrismaModule], 
  
})
export class ClientModule {}
