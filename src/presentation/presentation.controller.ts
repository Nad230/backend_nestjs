import { Body, Controller, Post } from '@nestjs/common'
import { CreatePresentationDto } from './dto/create-presentation.dto'
import { PresentationService } from './presentation.service'

@Controller('presentation')
export class PresentationController {
    constructor(private readonly presentationService: PresentationService) {}

    @Post()
    async create(@Body() dto: CreatePresentationDto) {
      const filePath = await this.presentationService.generatePresentation(dto)
      return { filePath }
    }
  
}
