import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TranslateService {
  private apiUrl = 'https://api.mymemory.translated.net/get'; // Example free API

  async translateText(text: string, targetLang: string): Promise<string> {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          q: text,
          langpair: `en|${targetLang}`,
        },
      });
      return response.data.responseData.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }
}
