import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsString,
    IsUUID,
    ValidateNested,
    IsNumber,
    Min,
  } from 'class-validator'
  import { Type } from 'class-transformer'
  
  class InvoiceItemDto {
    @IsString()
    @IsNotEmpty()
    description: string
  
    @IsNumber()
    @Min(0)
    amount: number
  }
  
  export class CreateInvoiceDto {
    @IsString()
    @IsNotEmpty()
    status: string
  
    @IsDateString()
    dueDate: string
  
    @IsUUID()
    clientId: string
  
    @IsUUID()
    projectId: string
    @IsUUID()
     createdBy: string; 
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[]
  }
  