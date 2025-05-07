import { Controller, UseGuards ,Post,Body,Request,Get, Param, Patch, InternalServerErrorException, NotFoundException, Put} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateInvoiceItemDto } from './dto/update-invoice-item.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}
     @UseGuards(JwtAuthGuard)   

    @Post()
    create(@Body() createInvoiceDto: CreateInvoiceDto,@Request() req) {
      return this.invoiceService.createInvoice(createInvoiceDto,req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getTasksByAssignee(@Request() req) {
        return this.invoiceService.getInvoicesForUser(req.user.sub);
    }


    @Patch('items/:id')
    async updateItem(
      @Param('id') id: string,
      @Body() dto: UpdateInvoiceItemDto,
      @Request() req,
    ) {
      // Ensure path ID matches DTO ID
      if (dto.id !== id) {
        throw new NotFoundException('Invoice item ID mismatch');
      }
  
      const userId = req.user.sub; // from JWT
      return this.invoiceService.updateInvoiceItem(dto, userId);
    }

    @Put('update')
    async updateInvoice(@Body() dto: UpdateInvoiceDto) {
      return this.invoiceService.updateInvoice(dto);
    }
}
