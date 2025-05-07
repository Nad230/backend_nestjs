import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  icon?: string;
}
