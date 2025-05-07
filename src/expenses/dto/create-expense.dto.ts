import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator'

export class CreateExpenseDto {
  @IsString()
  title: string

  @IsNumber()
  amount: number

  @IsString()
  type: string

  @IsOptional()
  @IsString()
  repeatType?: string
  @IsOptional()
  @IsBoolean()
  repeat?: boolean

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsDateString()
  date: string
}
