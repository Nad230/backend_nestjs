// src/dto/update-invoice-item.dto.ts

import {
    IsUUID,
    IsOptional,
    IsString,
    IsNumber,
    Min,
  } from 'class-validator';
  
  export class UpdateInvoiceItemDto {
    @IsUUID()
    id: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number;
  }
  