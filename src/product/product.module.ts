import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
      imports: [AuthModule], 
  providers: [ProductService,PrismaService],
  controllers: [ProductController]
})
export class ProductModule {}
