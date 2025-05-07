import { Injectable } from '@nestjs/common'
import * as PptxGenJS from 'pptxgenjs'
import { CreatePresentationDto } from './dto/create-presentation.dto'
import * as fs from 'fs'
import * as path from 'path'


@Injectable()
export class PresentationService {
  async generatePresentation(dto: CreatePresentationDto): Promise<string> {
    const pptx = new (PptxGenJS as any)()
    const themes = {
      modern: {
        backgroundColor: 'F2F2F2',
        titleColor: '1C1C1C',
        textColor: '2E2E2E',
        titleFont: 'Montserrat',
        textFont: 'Open Sans',
        titleFontSize: 36,
        textFontSize: 20,
      },
      elegant: {
        backgroundColor: '1F1F1F',
        titleColor: 'FFFFFF',
        textColor: 'DDDDDD',
        titleFont: 'Georgia',
        textFont: 'Times New Roman',
        titleFontSize: 40,
        textFontSize: 22,
      },
      fun: {
        backgroundColor: 'FFF5E1',
        titleColor: 'FF5733',
        textColor: '6C3483',
        titleFont: 'Comic Sans MS',
        textFont: 'Arial',
        titleFontSize: 38,
        textFontSize: 21,
      },
      minimal: {
        backgroundColor: 'FFFFFF',
        titleColor: '000000',
        textColor: '333333',
        titleFont: 'Helvetica',
        textFont: 'Helvetica',
        titleFontSize: 36,
        textFontSize: 20,
      },
      tech: {
        backgroundColor: '0B0C10',
        titleColor: '66FCF1',
        textColor: 'C5C6C7',
        titleFont: 'Consolas',
        textFont: 'Roboto',
        titleFontSize: 34,
        textFontSize: 19,
      },
    }
    
    const theme = themes[dto.theme] || themes['modern']
  
    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { fill: theme.backgroundColor },
    })
  
    const titleOpts = {
      fontFace: theme.titleFont,
      fontSize: theme.titleFontSize,
      color: theme.titleColor,
      bold: true,
      align: 'center' as const,
    }
  
    const textOpts = {
      fontFace: theme.textFont,
      fontSize: theme.textFontSize,
      color: theme.textColor,
      align: 'left' as const,
    }
  
    let slideIndex = 1
  
    // 🔹 Title Slide
    const titleSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' })
    titleSlide.addText(dto.title, { ...titleOpts, y: 2, x: 1, w: '80%', h: 1 })
    titleSlide.addText(`By ${dto.fullName}`, { ...textOpts, y: 3.5, x: 1, w: '80%' })
  
    // 🔹 Chapter Slides
    for (const chapter of dto.chapters) {
      const chapterSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' })
      chapterSlide.addText(chapter.title, { ...titleOpts, y: 2, x: 1, w: '80%' })
      slideIndex++
  
      for (let i = 1; i <= chapter.numberOfSlides; i++) {
        if (slideIndex >= dto.totalSlides) break
  
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' })
        slide.addText(`${chapter.title} - Slide ${i}`, {
          ...textOpts,
          x: 0.5,
          y: 1,
          w: '90%',
        })
  
        // Example footer or shape based on theme
        if (dto.theme === 'elegant' || dto.theme === 'tech') {
          slide.addText(dto.fullName, {
            fontFace: theme.textFont,
            fontSize: 10,
            color: theme.textColor,
            x: 0.5,
            y: '90%',
            w: '90%',
            align: 'center',
          })
        }
  
        slideIndex++
      }
  
      if (slideIndex >= dto.totalSlides) break
    }
  
    const dirPath = path.join(__dirname, '..', '..', 'presentations')
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
  
    const buffer = await pptx.write({ outputType: 'arraybuffer' }) as ArrayBuffer
    const fileName = `presentation-${Date.now()}.pptx`
    const outputPath = path.join(dirPath, fileName)
    fs.writeFileSync(outputPath, Buffer.from(buffer))
  
    return outputPath
  }
  
   
  
}
