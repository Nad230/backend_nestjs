import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateSaleDto } from '../sale/dto/update-sale.dto';
import { CreateSaleDto } from '../sale/dto/create-sale.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        userId,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    // Optional: make sure user owns the product before updating
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.userId !== userId) {
      throw new Error('Unauthorized or not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }


  async findAllByUser(userId: string) {
    return this.prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
  
    if (!product || product.userId !== userId) {
      throw new Error('Not found or unauthorized');
    }
  
    return this.prisma.product.delete({ where: { id } });
  }
  
  
}
