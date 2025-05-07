import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreatorService } from './creator.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-posts.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from 'src/supabase/supabase.service';
import { platform } from 'os';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService,private prisma: PrismaService,   
     private readonly supabaseService: SupabaseService
  ) {}
/*
  @Get('login')
  login(@Res() res: Response) {
    const authUrl = this.creatorService.getLoginUrl();
    res.redirect(authUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const { userData, longLivedToken } = await this.creatorService.handleCallback(code);
      
      res.cookie('fb_access_token', longLivedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });
      
      res.json({ userData });
    } catch (error) {
      console.error('Authentication failed:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }


  @Get('growth/:profileId')
  async getGrowthHistory(@Param('profileId') profileId: string) {
    return this.prisma.socialStats.findMany({
      where: { profileId },
      orderBy: { date: 'desc' },
      select: {
        date: true,
        followers: true,
        followerGrowth: true
      }
    });
  }

  @Get('profiles')
  async getAllProfiles() {
    return this.creatorService.getAllProfiles();
  }

  @Get('profiles/:profileId')
  async getProfileById(@Param('profileId') profileId: string) {
    return this.creatorService.getProfileById(profileId);
  }

  @Get('profiles/user/:userId')
  async getProfileByUserId(@Param('userId') userId: string) {
    return this.creatorService.getProfileByUserId(userId);
  }

  @Get('profiles/platform/:platform')
  async getProfilesByPlatform(@Param('platform') platform: string) {
    return this.creatorService.getProfilesByPlatform(platform);
  }
  @Get('state-social/platform/:platform')
  async getStateByPlatform(@Param('platform') platform: string) {
    return this.creatorService.getStateByPlatform(platform);
  }


  @Get('state-social')
  async getAllStateSocial() {
    return this.creatorService.getAllStateSocial();
  }

  @Get('state-social/profile/:profileId')
  async getStateSocialByProfileId(@Param('profileId') profileId: string) {
    return this.creatorService.getStateSocialByProfileId(profileId);
  }

  @Get('state-social/user/:userId')
  async getStateSocialByUserId(@Param('userId') userId: string) {
    return this.creatorService.getStateSocialByUserId(userId);
  }

  

  @UseGuards(JwtAuthGuard)
  @Get('account')
  async getAccount(@Req() req, @Res() res: Response) {
    try {
    const accessToken = req.cookies['fb_access_token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthenticated' });
    console.log('req.user in getAccount:', req.user);

    const userId = req.user.sub // Get user ID from JWT
    const accountData = await this.creatorService.getAccount(accessToken, userId);
    console.log("Decoded user from JWT:", req.user);
    res.json(accountData);
  } catch (error) {
    console.error('Account fetch failed:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
}


  @Get('posts')
  async getFacebookPosts(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies['fb_access_token'];
      if (!accessToken) return res.status(401).json({ error: 'Unauthenticated' });

      const posts = await this.creatorService.getFacebookPosts(accessToken);
      res.json(posts);
    } catch (error) {
      console.error('Posts fetch failed:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }
  @Get('instagram/best/post')
  async getInstagramBestPost(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies['fb_access_token'];
      if (!accessToken) return res.status(401).json({ error: 'Unauthenticated' });

      const posts = await this.creatorService.getBestInstagramPost(accessToken);
      res.json(posts);
    } catch (error) {
      console.error('Instagram posts fetch failed:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch Instagram posts' });
    }
  }

  @Get('instagram/posts')
  async getInstagramPosts(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies['fb_access_token'];
      if (!accessToken) return res.status(401).json({ error: 'Unauthenticated' });

      const posts = await this.creatorService.getInstagramPosts(accessToken);
      res.json(posts);
    } catch (error) {
      console.error('Instagram posts fetch failed:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch Instagram posts' });
    }
  }
  @Get('instagram/Com')
  async getInstagram(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies['fb_access_token'];
      if (!accessToken) return res.status(401).json({ error: 'Unauthenticated' });

      const posts = await this.creatorService.getInstagramCommenters(accessToken);
      res.json(posts);
    } catch (error) {
      console.error('Instagram posts fetch failed:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch Instagram posts' });
    }
  }

  @Get('instagram/fans')
  async getInstagramFan(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies['fb_access_token'];
      if (!accessToken) return res.status(401).json({ error: 'Unauthenticated' });

      const posts = await this.creatorService.getInstagramCommentersDetailed(accessToken);
      res.json(posts);
    } catch (error) {
      console.error('Instagram posts fetch failed:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch Instagram posts' });
    }
  }
 




@Get('growth/daily/:profileId')
async getDailyFollowerGrowth(
  @Param('profileId') profileId: string,
  @Query('date') dateString?: string
) {
  const date = dateString ? new Date(dateString) : new Date();
  return await this.creatorService.getDailyFollowerGrowth(profileId, date);
}
@Get('growth/weekly/:profileId')
async getWeeklyFollowerGrowth(
  @Param('profileId') profileId: string,
) {
  return await this.creatorService.getWeeklyFollowerGrowth(profileId);
}



@Get('engagement/:profileId')
async getGlobalEngagement(
  @Param('profileId') profileId: string,
) {
  return await this.creatorService.getGlobalEngagement(profileId);
}
@Get('engagementGrwoth/:profileId')
async getGrowthEngagement(
  @Param('profileId') profileId: string,
) {
  return await this.creatorService.getGrowthEngagement(profileId);
}
@Get('engagement/best-worst/:profileId')
  async getBestWorstDays(@Param('profileId') profileId: string) {
    return await this.creatorService.getBestWorstDays(profileId);
  }

  // Engagement trend over time (default last 7 days, can be adjusted via query param)
  @Get('engagement/trend/:profileId')
  async getEngagementTrend(
    @Param('profileId') profileId: string,
    @Query('days') days: string,
  ) {
    const daysNumber = Number(days) || 7;
    return await this.creatorService.getEngagementTrend(profileId, daysNumber);
  }

  // Engagement rate (%) calculated from the latest stats
  @Get('engagement/rate/:profileId')
  async getEngagementRate(@Param('profileId') profileId: string) {
    return await this.creatorService.getEngagementRate(profileId);
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const oldToken = req.cookies['fb_access_token'];
      if (!oldToken) return res.status(401).json({ error: 'Unauthenticated' });

      const newToken = await this.creatorService.refreshToken(oldToken);
      
      res.cookie('fb_access_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });
      
      res.json({ message: 'Token refreshed successfully' });
    } catch (error) {
      console.error('Token refresh failed:', error);
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  }
 
  

 
  @UseGuards(JwtAuthGuard)
  @Post('createPost')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Body() body: { caption: string; status: string; platform: string; hashtags: string;  scheduledAt: Date },
    @Req() req // Get the authenticated request
  ) {
    const fileUrl = await this.supabaseService.uploadFile(file, 'postUploads');
  
    return this.creatorService.createScheduledPost({
      caption: body.caption,
      mediaUrl: fileUrl,
      mediaType: file.mimetype,
      status: body.status,
      platform:body.platform,
      hashtags: body.hashtags,
      scheduledAt: body.scheduledAt,
      uploadedBy: req.user.sub // Extracted from JWT token
    });
  }
  
  

  @UseGuards(JwtAuthGuard)
  @Post('PublichPost/:postId')
  publich(@Param('postId') postId: string) {
    return this.creatorService.publishNow( postId);
  }

  
 */ 
}