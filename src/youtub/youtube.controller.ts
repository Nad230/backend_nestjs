// src/youtube/youtube.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('videos')
  async getVideos(
    @Query('searchQuery') searchQuery: string,
    @Query('pageToken') pageToken?: string,
  ) {
    return this.youtubeService.getVideos(searchQuery, pageToken);
  }
}