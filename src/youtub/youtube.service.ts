// src/youtube/youtube.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class YoutubeService {
  private readonly apiKey = 'AIzaSyD9Zs-z9eV23M3otOkAjM4CGsChocRek28'; // Remplacez par votre clé API

  async getVideos(searchQuery: string, pageToken?: string) {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            q: searchQuery,
            type: 'video',
            maxResults: 10,
            pageToken: pageToken || undefined,
            key: this.apiKey,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error.response?.data || error.message);
      throw new Error('Failed to fetch videos');
    }
  }
}
