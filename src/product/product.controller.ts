import { Controller, Post, Body, Patch, Param, UseGuards, Request, Get, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateSaleDto } from '../sale/dto/create-sale.dto';
import { UpdateSaleDto } from '../sale/dto/update-sale.dto';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const userId = req.user.sub;
    return this.productService.create(createProductDto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Request() req) {
    const userId = req.user.sub;
    return this.productService.update(id, updateProductDto, userId);
  }
  @Get()
findAll(@Request() req) {
  const userId = req.user.sub;
  return this.productService.findAllByUser(userId);
}
@Delete(':id')
remove(@Param('id') id: string, @Request() req) {
  const userId = req.user.sub;
  return this.productService.remove(id, userId);
}

  
}
