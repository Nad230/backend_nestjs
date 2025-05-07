import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TranslateService } from './translation.service';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Get()
  async translate(@Query('text') text: string, @Query('lang') lang: string) {
    if (!text || !lang) {
      return { error: 'Missing text or target language' };
    }
    const translatedText = await this.translateService.translateText(text, lang);
    return { translatedText };
  }

  @Post('bulk')
  async translateBulk(@Body() body: { texts: string[], lang: string }) {
    if (!body.texts || !body.lang) {
      return { error: 'Missing texts array or target language' };
    }
    const translations = await Promise.all(
      body.texts.map(text => this.translateService.translateText(text, body.lang))
    );
    return { translations };
  }
}
