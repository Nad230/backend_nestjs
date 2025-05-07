import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAcademicProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  vibe: string

  @IsString()
  purpose: string

  @IsString()
  vision: string

  @IsString()
  firstMove: string

  @IsString()
  theme: string

  @IsString()
  frequency: string

  @IsString()
  spirit: string
}
