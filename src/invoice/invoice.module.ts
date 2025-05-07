import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [InvoiceService],
  controllers: [InvoiceController],
    imports: [AuthModule,PrismaModule], 
  
})
export class InvoiceModule {}
