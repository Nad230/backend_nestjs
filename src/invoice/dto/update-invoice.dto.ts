// src/dto/update-invoice.dto.ts

import {
    IsUUID,
    IsOptional,
    IsString,
    IsDateString,
  } from 'class-validator';
  
  export class UpdateInvoiceDto {
    @IsUUID()
    id: string;
  
    @IsOptional()
    @IsString()
    status?: string;
  
    @IsOptional()
    @IsDateString()
    dueDate?: string;
  }
  