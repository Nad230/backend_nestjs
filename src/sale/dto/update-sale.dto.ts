import { IsString, IsInt, IsDateString } from 'class-validator';

export class UpdateSaleDto {
  @IsString()
  productId: string;

  @IsInt()
  quantity: number;

  @IsDateString()
  date: string; // Expecting ISO format string like "2025-04-18"
}
