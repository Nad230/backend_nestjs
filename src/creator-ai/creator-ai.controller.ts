import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { CreatorAiService } from './creator-ai.service';

class GenerateContentDto {
  platform: string;
  contentType: string;
  topic: string;
  tone: string;
}
@Controller('creator-ai')
export class CreatorAiController {
    constructor(private readonly creatorAiService: CreatorAiService) {}

    @Get('trending')
    async getTrending(@Query('platform') platform: string) {
      return this.creatorAiService.getTrendingHashtags(platform);
    }
    @Post('generate')
    async generateContent(
      @Body() body: { 
        goal: string,
        platform: string, 
        topic: string, 
        tone: string,
        contentType: string 
      }
    ) {
      const generated = await this.creatorAiService.generateContent(
        body.goal,
        body.platform,
        body.topic,
        body.tone,
        body.contentType
      );
      return { generatedText: generated,
        usedUrl: this.getUsedUrl(body.contentType)

       };
    }
    

private getUsedUrl(contentType: string): string {
  if (contentType === 'image') return this.creatorAiService['imageUrl'];
  if (contentType === 'video') return this.creatorAiService['videoUrl'];
  return this.creatorAiService['apiUrl'];
}

   
}

