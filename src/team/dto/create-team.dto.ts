import { IsOptional, IsString, IsEnum, IsDateString, isInt, IsNumber, IsNotEmpty, IsArray, ArrayMinSize, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;


  @IsOptional()
  @IsString()
  status?: string;

 
  @IsUUID()
    userId: string;
  
    @IsNotEmpty()
    @IsUUID()
    projectId: any;
  @IsArray()
  @ArrayMinSize(1) // Ensure at least one member is selected
  @IsString({ each: true }) // Validate each element in the array
  @IsNotEmpty({ each: true }) // Ensure no empty values in the array
  TeamMembers: string[];
  
}
