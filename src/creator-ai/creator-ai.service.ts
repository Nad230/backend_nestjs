import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as FormData from 'form-data';

@Injectable()
export class CreatorAiService {
  private readonly logger = new Logger(CreatorAiService.name);

  // New API URLs
  private readonly replicateModelUrl ='https://api.replicate.com/v1/models/wan-video/wan-2.1-1.3b/predictions'; 
   private readonly stabilityUrl = 'https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image';

  constructor() {
    axiosRetry(axios, {
      retries: 5,
      retryDelay: (retryCount) => {
        const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        this.logger.warn(`Retry #${retryCount} - Waiting ${delay}ms`);
        return delay;
      },
      retryCondition: (error) =>
        error.response?.status === 503 ||
        error.response?.status === 429 ||
        error.code === 'ECONNABORTED'
    });
  }

  async  imageToVideo(base64Png: string) {
    // 1) Convert base64 → Buffer
    const buffer = Buffer.from(base64Png, 'base64');
  
    // 2) Prepare multipart form data
    const form = new FormData();
    // “inputs” is the file field for HF’s image‑to‑video inference
    form.append('inputs', buffer, { filename: 'frame.png', contentType: 'image/png' });
    // You can also tweak these parameters if supported (optional)
    form.append(
      'parameters',
      JSON.stringify({
        num_inference_steps: 25,    // more frames/quality tradeoff
        guidance_scale: 7.5          // how strongly it follows your prompt
      })
    );
  
    // 3) Call Hugging Face Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid',
      form,
      {
        responseType: 'arraybuffer',   // get raw bytes back
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          ...form.getHeaders()
        },
        timeout: 120_000
      }
    );
  
    // 4) Convert the returned video bytes → base64
    const videoBase64 = Buffer.from(response.data, 'binary').toString('base64');
    return videoBase64;  // this is an MP4 (or GIF) encoded in base64
  }





  async generateContent(platform: string, goal: string, topic: string, tone: string, contentType: string) {
    if (!contentType || typeof contentType !== 'string') {
      throw new BadRequestException('Invalid or missing contentType');
    }
  
    const type = contentType.toLowerCase();
    const prompt = this.createPrompt(platform, goal, topic, tone, contentType);
  
    try {
      if (type === 'caption' || type === 'hashtags' || type === 'content ideas' || type === 'audio voiceover') {
        // Use Hugging Face for all text-based requests individually
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
          { inputs: prompt },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );
        return this.handleResponse(response);
      }
  
      if (type === 'image') {
        const form = new FormData();
        form.append('prompt', prompt);
        form.append('output_format', 'png');
  
        const stabilityResponse = await axios.post(
          'https://api.stability.ai/v2beta/stable-image/generate/core',
          form,
          {
            headers: {
              ...form.getHeaders(),
              Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            },
            timeout: 60000,
          }
        );
  
        return stabilityResponse.data;
      }
  
      if (type === 'video') {
        const response = await axios.post(
          "https://camenduru-text-to-video-zero.hf.space/run/predict",
          {
            data: [prompt],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 120000,
          }
        );
  
        const outputPath = response.data?.data?.[0];
        if (!outputPath) throw new Error("Video generation failed or returned no output");
  
        const videoUrl = `https://camenduru-text-to-video-zero.hf.space/file=${outputPath}`;
        const videoBuffer = await axios.get(videoUrl, { responseType: "arraybuffer" });
        const videoBase64 = Buffer.from(videoBuffer.data).toString("base64");
  
        return { video: videoBase64 };
      }
  
      return `Unsupported content type: ${contentType}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`HTTP ${error.response?.status}:`, error.response?.data);
      } else {
        this.logger.error(error.message);
      }
      return 'An error occurred while generating content.';
    }
  }
  



 

  private validateEnvironment() {
    if (!process.env.HF_API_KEY) {
      throw new Error('Hugging Face API key is missing');
    }
  }

  private handleResponse(response: any): string {
    if (response.data?.error && response.data?.estimated_time) {
      this.logger.warn(`Model loading - estimated time: ${response.data.estimated_time}s`);
      return 'The model is currently loading. Please try again in a few moments.';
    }

    if (!response.data || !Array.isArray(response.data) || !response.data[0]?.generated_text) {
      this.logger.warn('Unexpected API response format');
      return 'Content generation failed. Please try again.';
    }

    const generatedText = response.data[0].generated_text;
    const cleanedText = generatedText.replace(/.*?\n\n/, '');

    return cleanedText.trim();
  }

  private handleError(error: any): string {
    this.logger.error(`API Error: ${error.message}`, error.stack);

    if (error.response) {
      this.logger.error(`HTTP ${error.response.status}: ${error.response.data}`);
      return 'Service temporarily unavailable. Please try again later.';
    }

    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection.';
    }

    return 'Content generation failed. Please try again.';
  }

  createPrompt(platform: string, goal: string, topic: string, tone: string, contentType: string): string {
    const base = `Platform: ${platform}\nGoal: ${goal}\nTopic: ${topic}\nTone: ${tone}`;
  
    switch (contentType.toLowerCase()) {
      case 'caption':
        return `${base}\nGenerate a creative and engaging social media caption.`;
      case 'hashtags':
        return `${base}\nGenerate a list of relevant and trending hashtags.`;
      case 'content ideas':
        return `${base}\nGive me 5 unique and creative content ideas in bullet point format. Each idea should include a short title and a one-line description.`;
      case 'audio voiceover':
        return `${base}\nWrite a short and engaging script for a voiceover based on the topic.`;
      case 'image':
      case 'video':
        return `${base}\nCreate a visual concept based on this topic.`;
      default:
        return `${base}\nGenerate content.`;
    }
  }
  






 




  async getTrendingHashtags(platform: string): Promise<string[]> {
    this.logger.log(`Fetching trending hashtags for ${platform}...`);

    try {
      switch (platform.toLowerCase()) {
        case 'instagram':
          return await this.fetchInstagramTrends();
        case 'twitter':
          return await this.fetchTwitterTrends();
        case 'tiktok':
          return await this.fetchTiktokTrends();
        case 'facebook':
          return await this.fetchFacebookTrends();
        default:
          this.logger.warn(`Unsupported platform: ${platform}`);
          return [];
      }
    } catch (error) {
      this.logger.error(`Error fetching hashtags for ${platform}: ${error.message}`);
      return [];
    }
  }

  private async fetchInstagramTrends(): Promise<string[]> {
    // Instagram does not provide an official API for trends, so this is a placeholder.
    return ['#Reels', '#ViralPost', '#TrendingNow', '#InstaFamous'];
  }

  private async fetchTwitterTrends(): Promise<string[]> {
    const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
    if (!BEARER_TOKEN) {
      throw new Error('Twitter API key is missing');
    }

    try {
      const response = await axios.get('https://api.twitter.com/2/trends/place.json?id=1', {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      });

      return response.data[0].trends.map((trend: any) => trend.name);
    } catch (error) {
      this.logger.error('Error fetching Twitter trends:', error);
      return [];
    }
  }

  private async fetchTiktokTrends(): Promise<string[]> {
    // TikTok trends are typically fetched via scraping or third-party APIs.
    return ['#TikTokTrend', '#FYP', '#ViralChallenge'];
  }

  private async fetchFacebookTrends(): Promise<string[]> {
    // Facebook does not provide an official trending API.
    return ['#FBTrending', '#FacebookHot', '#TrendingToday'];
  }

}
