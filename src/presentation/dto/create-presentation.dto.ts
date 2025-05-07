import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsHexColor } from 'class-validator'
import { Type } from 'class-transformer'

class ChapterSlideDto {
  @IsString()
  title: string

  @IsNumber()
  numberOfSlides: number
}

class PresentationStructureDto {
  @IsString()
  chapterTitle: string

  @IsNumber()
  slideCount: number
}

export class CreatePresentationDto {
  @IsString()
  fullName: string

  @IsString()
  title: string
  @IsString()
theme: 'modern' | 'elegant' | 'fun' | 'minimal' | 'tech' // or import the enum if shared


  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  titleFont: string

  @IsString()
  textFont: string

  @IsNumber()
  titleFontSize: number

  @IsNumber()
  textFontSize: number

  @IsHexColor()
  titleColor: string

  @IsHexColor()
  textColor: string

  @IsNumber()
  totalSlides: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChapterSlideDto)
  chapters: ChapterSlideDto[]
}
