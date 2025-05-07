import { PackageType } from '@prisma/client';
import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  firstTime?: string;

  @IsOptional()
  @IsString()
  projectName?: string;
  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  startHour?: number;

  @IsOptional()
  endHour?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  BudgetRange?: number;







  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  profile_photo?:string;
  @IsEnum(PackageType)
  packageType?:PackageType;
}
