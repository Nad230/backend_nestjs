import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceItemDto } from './dto/update-invoice-item.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: PrismaService) {}

    async createInvoice(dto: CreateInvoiceDto,userId:string) {
      const { status, dueDate, clientId, projectId, items } = dto
  
      const invoice = await this.prisma.invoice.create({
        data: {
          status,
          dueDate: new Date(dueDate),
          client: { connect: { id: clientId } },
          project: { connect: { id: projectId } },
          creator: {
            connect: {
              id: userId,
            },
          },
          
          items: {
            create: items.map((item) => ({
              description: item.description,
              amount: item.amount,
            })),
          },
        },
        include: {
          items: true,
        },
      })
  
      return invoice
    }

    async getInvoicesForUser(userId: string) {
        return this.prisma.invoice.findMany({
          where: { createdBy: userId },
          include: {
            items: true,
            client: true,
            project: true,
          },
          orderBy: { createdAt: 'desc' },
        })
      }
      async updateInvoice(dto: UpdateInvoiceDto) {
        const { id, status, dueDate } = dto;
        const data: Record<string, any> = {};
      
        if (status !== undefined) data.status = status;
        if (dueDate !== undefined) data.dueDate = new Date(dueDate);
      
        // Update the invoice directly by ID
        const updatedInvoice = await this.prisma.invoice.update({
          where: { id },
          data,
          include: {
            items: true,
            client: true,
            project: true,
          },
        });
      
        return updatedInvoice;
      }
      
      async updateInvoiceItem(dto: UpdateInvoiceItemDto, userId: string) {
        const { id, description, amount } = dto;
        const data: Record<string, any> = {};
    
        if (description !== undefined) data.description = description;
        if (amount      !== undefined) data.amount      = amount;
    
        // Only update item if its invoice.creator = userId
        const result = await this.prisma.invoiceItem.updateMany({
          where: {
            id,
            invoice: {
              createdBy: userId,
            },
          },
          data,
        });
    
        if (result.count === 0) {
          throw new NotFoundException(
            'Invoice item not found or you do not have permission to update it'
          );
        }
    
        // Return the updated item
        return this.prisma.invoiceItem.findUnique({
          where: { id },
        });
      }
    
}
