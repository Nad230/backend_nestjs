// src/dto/update-client.dto.ts

import {
    IsUUID,
    IsOptional,
    IsString,
    IsNotEmpty,
  } from 'class-validator';
  
  export class UpdateClientDto {
    @IsUUID()
    id: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;
  
    @IsOptional()
    @IsString()
    photo?: string;
  
    @IsOptional()
    @IsUUID()
    userId?: string;  // to (re)link this client to a platform user
  }
  