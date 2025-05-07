import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { CreatePostDto } from './dto/create-posts.dto';

@Injectable()
export class CreatorService {
  private readonly apiVersion = 'v19.0';  // Add this constant

  private clientId = '1189273345974161';
  private clientSecret = 'ded4050616d02c18617ef5989f00df3e';
  private redirectUri = 'http://localhost:3000/auth/facebook/callback';

  constructor(private prisma: PrismaService) {}

/*
  getLoginUrl(): string {
    return `https://www.facebook.com/${this.apiVersion}/dialog/oauth?client_id=${
      this.clientId
    }&redirect_uri=${this.redirectUri}&scope=${
      'email,public_profile,pages_show_list,' +
      'instagram_basic,instagram_manage_insights,' +
      'instagram_manage_comments,instagram_manage_messages'  // Added manage_comments
    }`;
  }
  async handleCallback(code: string) {
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: { client_id: this.clientId, client_secret: this.clientSecret, redirect_uri: this.redirectUri, code },
    });
    const accessToken = tokenResponse.data.access_token;
  
    const longLivedTokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: { grant_type: 'fb_exchange_token', client_id: this.clientId, client_secret: this.clientSecret, fb_exchange_token: accessToken },
    });
    const longLivedToken = longLivedTokenResponse.data.access_token;
  
    // Fetch user data but DON'T save it yet
    const userProfileResponse = await axios.get('https://graph.facebook.com/me', {
      params: { fields: 'id,name,email,picture', access_token: longLivedToken },
    });
    const userData = userProfileResponse.data;
  
    return { userData, longLivedToken };
  }
  
  async getAccount(accessToken: string, userId: string) {
    console.log("🚀 getAccount function started for user:", userId);
  
    try {
      // Fetch Facebook profile
      console.log("📡 Fetching Facebook profile...");
      const fbProfileResponse = await axios.get(`https://graph.facebook.com/me`, {
        params: { fields: "id,name,email,picture", access_token: accessToken },
      });
      const fbProfile = fbProfileResponse.data;
      console.log("✅ Facebook profile fetched:", fbProfile);
  
      // Fetch linked Facebook Pages
      console.log("📡 Fetching Facebook pages...");
      const pageResponse = await axios.get(`https://graph.facebook.com/me/accounts`, {
        params: { access_token: accessToken },
      });
  
      const pageId = pageResponse.data.data?.[0]?.id; // Get first page ID
      console.log("📌 Found Page ID:", pageId);
  
      if (!pageId) {
        console.log("⚠️ No Facebook page found. Saving Facebook profile only...");
        await this.saveProfile(userId, "Facebook", fbProfile.id, fbProfile.name, fbProfile.picture?.data?.url);
        return { platform: "Facebook", profile: fbProfile };
      }
  
      // Fetch Instagram Business Account ID
      console.log("📡 Fetching Instagram Business Account...");
      const instagramResponse = await axios.get(`https://graph.facebook.com/${pageId}`, {
        params: { fields: "instagram_business_account", access_token: accessToken },
      });
  
      const instagramId = instagramResponse.data.instagram_business_account?.id;
      console.log("📌 Instagram Business Account ID:", instagramId);
  
      if (!instagramId) {
        console.log("⚠️ No Instagram Business Account found. Saving Facebook profile only...");
        await this.saveProfile(userId, "Facebook", fbProfile.id, fbProfile.name, fbProfile.picture?.data?.url);
        return { platform: "Facebook", profile: fbProfile };
      }
  
      // Fetch Instagram profile details
      console.log("📡 Fetching Instagram profile...");
      const instagramProfileResponse = await axios.get(`https://graph.facebook.com/${instagramId}`, {
        params: { fields: "id,username,profile_picture_url,followers_count", access_token: accessToken },
      });
  
      const instagramProfile = instagramProfileResponse.data;
      console.log("✅ Instagram profile fetched:", instagramProfile);
  
      // Save profiles to DB
      console.log("💾 Saving profiles to database...");
      
      // Save Facebook profile
const fbProfileEntry = await this.saveProfile(userId, "Facebook", fbProfile.id, fbProfile.name, fbProfile.picture?.data?.url, accessToken);
if (!fbProfileEntry) {
  console.error("❌ Failed to save Facebook profile. Skipping social stats.");
  return { error: "Failed to save Facebook profile" };
}
console.log("🔹 Facebook Profile Entry ID:", fbProfileEntry?.id);
if (!fbProfileEntry?.id) {
  console.error("❌ Error: Facebook Profile Entry ID is missing!");
  return { error: "Invalid Facebook profile ID" };
}
console.log("📌 Calling saveInitialSocialStats with:", {
  profileId: fbProfileEntry.id,
  platform: "Facebook",
  accessToken: accessToken ? "✅ Provided" : "❌ Missing"
});

await this.saveInitialSocialStats(fbProfileEntry.id, "Facebook", accessToken);


await this.saveInitialSocialStats(fbProfileEntry.id, "Facebook", accessToken);
console.log("🛠️ Preparing to save Instagram profile...");
console.log("📌 Instagram Profile Object:", instagramProfile);

if (!instagramProfile || !instagramProfile.id || !instagramProfile.username) {
  console.error("❌ Invalid Instagram profile data. Skipping save operation.");
  return { error: "Invalid Instagram profile data" };
}

// Save Instagram profile
// Log Instagram profile before saving
console.log("🛠️ Preparing to save Instagram profile...");
console.log("📌 Instagram ID:", instagramProfile.id);
console.log("📌 Instagram Username:", instagramProfile.username);
console.log("📌 Instagram Profile Picture:", instagramProfile.profile_picture_url);

// Save Instagram profile
const instaProfileEntry = await this.saveProfile(
  userId,
  "Instagram",
  instagramProfile.id,
  instagramProfile.username,
  instagramProfile.profile_picture_url,
  accessToken
);

if (!instaProfileEntry) {
  console.error("❌ Failed to save Instagram profile. Skipping social stats.");
  return { error: "Failed to save Instagram profile" };
}

await this.saveInitialSocialStats(instaProfileEntry.id, "Instagram", accessToken);


      console.log("✅ Profiles saved successfully!");
  
      return {
        facebook: {
          id: fbProfile.id,
          name: fbProfile.name,
          email: fbProfile.email,
          picture: fbProfile.picture?.data?.url,
          posts:fbProfile.post,
          initialStats: await this.prisma.socialStats.findFirst({ where: { profileId: fbProfileEntry.id } }),
        },
        instagram: {
          id: instagramProfile.id,
          username: instagramProfile.username,
          profile_picture: instagramProfile.profile_picture_url,
          followers: instagramProfile.followers_count,
          posts:instagramProfile.post,

          initialStats: await this.prisma.socialStats.findFirst({ where: { profileId: instaProfileEntry.id } }),
        },
      };
    } catch (error) {
      console.error("❌ Error fetching social profiles:", error?.response?.data || error.message);
      return { error: "Failed to retrieve account details" };
    }
  }
  
  async saveProfile(
    userId: string,
    platform: string,
    platformId: string,
    username: string,
    profilePic?: string,
    accessToken?: string
  ) {
    console.log(`💾 Attempting to save profile...`);
    console.log(`🔹 User ID: ${userId}`);
    console.log(`🔹 Platform: ${platform}`);
    console.log(`🔹 Profile ID: ${platformId}`);
    console.log(`🔹 Name: ${username}`);
    console.log(`🔹 Picture URL: ${profilePic}`);
    console.log(`🔹 Access Token: ${accessToken ? "✅ Provided" : "❌ Missing"}`);
  
    if (!userId || !platform || !platformId) {
      console.error("❌ Missing required parameters for saving profile.");
      return null;
    }
    try {
      return await this.prisma.profile.upsert({
        where: { 
          userId_platform: {
            userId,
            platform
          }
        },
        update: {
          username,
          profilePic,
          accessToken
        },
        create: {
          userId,
          platform,
          username,
          profilePic,
          accessToken
        }
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }
async getAllProfiles() {
  return await this.prisma.profile.findMany();
}

async getProfileById(profileId: string) {
  return await this.prisma.profile.findUnique({
    where: { id: profileId },
  });
}

async getProfilesByPlatform(platform: string) {
  return await this.prisma.profile.findMany({
    where: { platform },
  });
}
async getStateByPlatform(platform: string) {
  return await this.prisma.socialStats.findMany({
    where: { platform },
  });
}
async getAllStateSocial() {
  return await this.prisma.socialStats.findMany();
}

async getStateSocialByProfileId(profileId: string) {
  return await this.prisma.socialStats.findMany({
    where: { profileId },
  });
}

async getProfileByUserId(userId: string) {
  return await this.prisma.profile.findMany({
    where: { userId },
  });
}


async getStateSocialByUserId(userId: string) {
  const profiles = await this.getProfileByUserId(userId);

  if (!profiles.length) {
    throw new NotFoundException('No profiles found for this user');
  }

  const stats = await this.prisma.socialStats.findMany({
    where: {
      profileId: { in: profiles.map((profile) => profile.id) },
    },
  });

  return stats;
}


async updateDailyStats(profileId: string, accessToken: string) {
  try {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: { SocialStats: { orderBy: { date: 'desc' } } }});

    if (!profile) throw new Error('Profile not found');

    // Always get the most recent stats regardless of date
    const latestStats = profile.SocialStats[0] || null;
    const platform = profile.platform.toLowerCase();
    const currentStats = await this.getSocialStatsFromAPI(platform, accessToken);

    // Calculate growth based on last available stats (could be any day)
    const growth = {
      followerGrowth: currentStats.followers - (latestStats?.followers || 0),
      likeGrowth: currentStats.likes - (latestStats?.likes || 0),
      commentGrowth: currentStats.comments - (latestStats?.comments || 0),
    };

    // Always update the most recent record regardless of date
    if (latestStats) {
      return await this.prisma.socialStats.update({
        where: { id: latestStats.id },
        data: {
          ...currentStats,
          ...growth,
        },
      });
    } else {
      // Only create if no stats exist at all
      return await this.prisma.socialStats.create({
        data: {
          profileId,
          platform: profile.platform,
          ...currentStats,
          ...growth,
          date: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error updating daily stats:', error);
    throw error;
  }
}

@Cron('0 0 * * *') // Still runs daily at midnight
async handleDailyUpdates() {
  try {
    console.log('[CRON] Starting daily stats update:', new Date().toISOString());
    
    const profiles = await this.prisma.profile.findMany();
    console.log(`Found ${profiles.length} profiles to update`);

    for (const profile of profiles) {
      try {
        const accessToken = profile.accessToken;
        
        if (!accessToken) {
          console.log(`Skipping profile ${profile.id} - no access token`);
          continue;
        }

        console.log(`Updating profile ${profile.id}...`);
        await this.updateDailyStats(profile.id, accessToken);
        console.log(`Profile ${profile.id} updated successfully`);
        
      } catch (error) {
        console.error(`Profile ${profile.id} error:`, error.message);
        if (error.response?.data?.error?.code === 190) {
          console.log(`Attempting token refresh for profile ${profile.id}`);
          await this.handleTokenRefresh(profile.id);
        }
      }
    }
  } catch (error) {
    console.error('Cron job failed:', error);
  }
}


private async handleTokenRefresh(profileId: string) {
  try {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId }
    });

    if (!profile?.accessToken) return;

    const newToken = await this.refreshToken(profile.accessToken);
    await this.prisma.profile.update({
      where: { id: profileId },
      data: { accessToken: newToken }
    });
    
    // Retry with new token
    await this.updateDailyStats(profileId, newToken);
  } catch (error) {
    console.error(`Failed to refresh token for profile ${profileId}:`, error);
  }
}


async getSocialStatsFromAPI(platform: string, accessToken: string) {
  
  if (!platform) {
    throw new Error("Invalid platform: platform is undefined");
  }

  const normalizedPlatform = platform.toLowerCase();
  console.log(`Fetching stats for platform: ${normalizedPlatform}`);

  if (normalizedPlatform === 'facebook') {
    const followers = await this.getFacebookFollowers(accessToken);
    const engagement = await this.getFacebookEngagement(accessToken);
    return {
      followers: followers?.followers || 0,
      likes: engagement?.totalLikes || 0,
      comments: engagement?.totalComments || 0,
    };
  } else if (normalizedPlatform === 'instagram') {
    const followers = await this.getInstagramFollowers(accessToken);
    const engagement = await this.getInstagramEngagement(accessToken);
    return {
      followers: followers?.followers || 0,
      likes: engagement?.totalLikes || 0,
      comments: engagement?.totalComments || 0,
    };
  }

  throw new Error(`Unsupported platform: ${normalizedPlatform}`);
}

async saveInitialSocialStats(profileId: string, platform: string, accessToken: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log(`🔍 Fetching social stats for ${platform} (Profile ID: ${profileId})`);

  if (!profileId || !platform) {
    console.error("❌ ERROR! profileId or platform is undefined!");
    console.log("🛑 Debug Info:", { profileId, platform });
    throw new Error("Invalid profile: profile or platform is undefined");
  }

  console.log(`🚀 Calling getSocialStatsFromAPI(${platform}, ${accessToken})`);
  
  const currentStats = await this.getSocialStatsFromAPI(platform, accessToken);

  console.log("📊 Received stats:", currentStats);

  if (!currentStats || typeof currentStats.followers === "undefined") {
    console.error(`❌ Error fetching ${platform} stats:`, currentStats);
    throw new Error(`Invalid ${platform} stats received`);
  }

  console.log(`✅ ${platform} Stats:`, currentStats);
  
  try {
    return await this.prisma.socialStats.upsert({
      where: {
        daily_stats: {
          profileId,
          date: today
        }
      },
      update: {
        followers: currentStats.followers,
        likes: currentStats.likes,
        comments: currentStats.comments
      },
      create: {
        profileId,
        platform,
        followers: currentStats.followers,
        likes: currentStats.likes,
        comments: currentStats.comments,
        date: today
      }
    });
  } catch (err) {
    console.error(`❌ Prisma Error Saving ${platform} Stats:`, err);
    throw new Error(`Failed to save ${platform} stats`);
  }
}




async getBestInstagramPost(accessToken: string) {
  try {
    // Reuse your existing method to get Instagram posts
    const mediaResponse = await this.getInstagramPosts(accessToken);
    if (!mediaResponse?.data) {
      throw new NotFoundException('No Instagram posts found');
    }

    // Find post with highest engagement using your existing data structure
    let bestPost: {
      id: string;
      caption?: string;
      like_count: number;
      comments_count: number;
      media_url: string;
      permalink?: string;
      timestamp: string;
      media_type: string;
    } | null = null;
    let maxEngagement = -1;

    for (const media of mediaResponse.data) {
      const engagement = (media.like_count || 0) + (media.comments_count || 0);
      if (engagement > maxEngagement) {
        maxEngagement = engagement;
        bestPost = media;
      }
    }

    if (!bestPost) {
      throw new NotFoundException('No posts found');
    }

    // Extract hashtags safely
    const hashtags = bestPost.caption?.match(/#\w+/g) || [];

    return {
      id: bestPost.id,
      caption: bestPost.caption,
      hashtags,
      likes: bestPost.like_count,
      comments: bestPost.comments_count,
      media_url: bestPost.media_url,
      permalink: bestPost.permalink,
      timestamp: bestPost.timestamp,
      engagement_score: maxEngagement,
      media_type: bestPost.media_type
    };
  } catch (error) {
    console.error('Error fetching best post:', error.response?.data || error.message);
    throw new NotFoundException('Failed to retrieve best post');
  }
}


  async getFacebookPosts(accessToken: string) {
    const postsResponse = await axios.get(`https://graph.facebook.com/me/posts`, {
      params: { fields: 'id,message,created_time,likes.summary(true),comments.summary(true)', access_token: accessToken },
    });
    return postsResponse.data;
  }

  async getInstagramPosts(accessToken: string) {
    const pageResponse = await axios.get(`https://graph.facebook.com/me/accounts`, { params: { access_token: accessToken } });
    const pageId = pageResponse.data.data?.[0]?.id;
    if (!pageId) return null;

    const instagramResponse = await axios.get(`https://graph.facebook.com/${pageId}`, {
      params: { fields: 'instagram_business_account', access_token: accessToken },
    });
    const instagramId = instagramResponse.data.instagram_business_account?.id;
    if (!instagramId) return null;

    const mediaResponse = await axios.get(`https://graph.facebook.com/${instagramId}/media`, {
      params: { fields: 'id,media_type,caption,like_count,comments_count,media_url,timestamp', access_token: accessToken },
    });
    return mediaResponse.data;
  }

  async getInstagramFollowers(accessToken: string) {
    // Step 1: Get the Facebook Page linked to the user's account
    const pageResponse = await axios.get(`https://graph.facebook.com/me/accounts`, {
      params: { access_token: accessToken },
    });
    const pageId = pageResponse.data.data?.[0]?.id;
    if (!pageId) return null;
  
    // Step 2: Get the Instagram Business Account ID linked to the Page
    const instagramResponse = await axios.get(`https://graph.facebook.com/${pageId}`, {
      params: { fields: 'instagram_business_account', access_token: accessToken },
    });
    const instagramId = instagramResponse.data.instagram_business_account?.id;
    if (!instagramId) return null;
  
    // Step 3: Get followers count from the Instagram Business Account
    const followersResponse = await axios.get(`https://graph.facebook.com/${instagramId}`, {
      params: { fields: 'followers_count', access_token: accessToken },
    });
  
    return { followers: followersResponse.data.followers_count };
  }

  async getInstagramCommenters(accessToken: string) {
    try {
      // Step 1: Get Facebook Page linked to the account
      const pageResponse = await axios.get(`https://graph.facebook.com/me/accounts`, {
        params: { access_token: accessToken },
      });
      const pageId = pageResponse.data.data?.[0]?.id;
      if (!pageId) return null;
  
      // Step 2: Get Instagram Business Account ID
      const instagramResponse = await axios.get(`https://graph.facebook.com/${pageId}`, {
        params: { fields: 'instagram_business_account', access_token: accessToken },
      });
      const instagramId = instagramResponse.data.instagram_business_account?.id;
      if (!instagramId) return null;
  
      // Step 3: Fetch recent media (posts, reels, etc.)
      const mediaResponse = await axios.get(`https://graph.facebook.com/${instagramId}/media`, {
        params: { fields: 'id', access_token: accessToken },
      });
  
      const mediaIds = mediaResponse.data.data.map((media: any) => media.id);
      if (!mediaIds.length) return null;
  
      const commenters = new Set<string>();
  
      // Step 4: Fetch comments on each media post
      for (const mediaId of mediaIds) {
        const commentsResponse = await axios.get(`https://graph.facebook.com/${mediaId}/comments`, {
          params: { fields: 'from{id,username}', access_token: accessToken },
        });
  
        // Add each commenter's username to the Set
        commentsResponse.data.data.forEach((comment: any) => {
          if (comment.from?.username) {
            commenters.add(comment.from.username);
          }
        });
      }
  
      return { commenters: Array.from(commenters) };
    } catch (error) {
      console.error('Error fetching Instagram commenters:', error.response?.data || error.message);
      return null;
    }
  }

  async getInstagramCommentersDetailed(accessToken: string) {
    try {
      // Step 1: Get Facebook Page linked to the account
      const pageResponse = await axios.get(`https://graph.facebook.com/me/accounts`, {
        params: { access_token: accessToken },
      });
      const pageId = pageResponse.data.data?.[0]?.id;
      if (!pageId) return null;
  
      // Step 2: Get Instagram Business Account ID
      const instagramResponse = await axios.get(`https://graph.facebook.com/${pageId}`, {
        params: { fields: 'instagram_business_account', access_token: accessToken },
      });
      const instagramId = instagramResponse.data.instagram_business_account?.id;
      if (!instagramId) return null;
  
      // Step 3: Fetch recent media (posts, reels, etc.)
      const mediaResponse = await axios.get(`https://graph.facebook.com/${instagramId}/media`, {
        params: { fields: 'id', access_token: accessToken },
      });
      const mediaIds = mediaResponse.data.data.map((media) => media.id);
      if (!mediaIds.length) return null;
  
      const commenters = new Map();
  
      // Step 4: Fetch comments on each media post
      for (const mediaId of mediaIds) {
        const commentsResponse = await axios.get(`https://graph.facebook.com/${mediaId}/comments`, {
          params: { fields: 'from{id,username}', access_token: accessToken },
        });
  
        for (const comment of commentsResponse.data.data) {
          if (comment.from?.id) {
            commenters.set(comment.from.id, {
              id: comment.from.id,
              username: comment.from.username,
            });
          }
        }
      }
  
      // Step 5: Fetch additional details for Business/Creator accounts
      for (const [id, commenter] of commenters) {
        try {
          const userResponse = await axios.get(`https://graph.facebook.com/${id}`, {
            params: {
              fields: 'biography,followers_count,follows_count,media_count',
              access_token: accessToken,
            },
          });
  
          // Only business/creator accounts return this data
          if (userResponse.data?.biography) {
            Object.assign(commenter, userResponse.data);
          }
        } catch (error) {
          console.warn(`Could not fetch additional details for user ${id}:`, error.response?.data || error.message);
        }
      }
  
      return { commenters: Array.from(commenters.values()) };
    } catch (error) {
      console.error('Error fetching Instagram commenters:', error.response?.data || error.message);
      return null;
    }
  }
  
  
  
  
  async getGlobalEngagement(profileId: string) {
    try {
      const stats = await this.prisma.socialStats.findMany({
        where: { profileId },
        orderBy: { date: 'desc' }, // Get the latest stats first
      });
  
      if (!stats.length) return null;
  
      let totalLikes = 0;
      let totalComments = 0;
      let totalLikeGrowth = 0;
      let totalCommentGrowth = 0;
  
      stats.forEach(entry => {
        totalLikes += entry.likes || 0;
        totalComments += entry.comments || 0;
        totalLikeGrowth += entry.likeGrowth || 0;
        totalCommentGrowth += entry.commentGrowth || 0;
      });
  
      return {
        totalLikes,
        totalComments,
        totalLikeGrowth,
        totalCommentGrowth,
        averageEngagement: stats.length > 0
          ? ((totalLikes + totalComments) / stats.length).toFixed(1)
          : 0,
      };
    } catch (error) {
      console.error('Error fetching engagement:', error);
      return null;
    }
  }
  async getGrowthEngagement(profileId: string) {
    try {
      const stats = await this.prisma.socialStats.findMany({
        where: { profileId },
        orderBy: { date: 'desc' }, // Get the latest stats first
      });
  
      if (!stats.length) return null;
  
      let totalLikeGrowth = 0;
      let totalCommentGrowth = 0;
  
      stats.forEach(entry => {
        totalLikeGrowth += entry.likeGrowth || 0;
        totalCommentGrowth += entry.commentGrowth || 0;
      });
  
      return {
        totalLikeGrowth,
        totalCommentGrowth,
        averageEngagement: stats.length > 0
          ? ((totalLikeGrowth +totalCommentGrowth) / stats.length).toFixed(1)
          : 0,
      };
    } catch (error) {
      console.error('Error fetching engagement:', error);
      return null;
    }
  }
  async getEngagementTrend(profileId: string, days: number = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
  
      const stats = await this.prisma.socialStats.findMany({
        where: { profileId, date: { gte: startDate } },
        orderBy: { date: 'asc' }, // Sorted for trends
      });
  
      return stats.map(entry => ({
        date: entry.date,
        likes: entry.likes ?? 0,
        comments: entry.comments ?? 0,
        engagement: (entry.likes ?? 0) + (entry.comments ?? 0),
      }));
    } catch (error) {
      console.error('Error fetching engagement trends:', error);
      return null;
    }
  }
  async getEngagementRate(profileId: string) {
    try {
      const latestStats = await this.prisma.socialStats.findFirst({
        where: { profileId },
        orderBy: { date: 'desc' },
      });
  
      if (!latestStats || latestStats.followers === 0) return null;
  
      // Use 0 if likes or comments are null
      const likes = latestStats.likes ?? 0;
      const comments = latestStats.comments ?? 0;
      const engagementRate = ((likes + comments) / latestStats.followers) * 100;
  
      return {
        engagementRate: engagementRate.toFixed(2) + '%',
      };
    } catch (error) {
      console.error('Error calculating engagement rate:', error);
      return null;
    }
  }
  async getBestWorstDays(profileId: string) {
    try {
      const stats = await this.prisma.socialStats.findMany({
        where: { profileId },
        orderBy: { date: 'asc' }, // Order by date as a fallback
      });
  
      if (!stats.length) return null;
  
      // Compute engagement on the fly for each entry
      const statsWithEngagement = stats.map(entry => ({
        ...entry,
        engagement: (entry.likes ?? 0) + (entry.comments ?? 0),
      }));
  
      // Sort in descending order to get the best performing day first
      statsWithEngagement.sort((a, b) => b.engagement - a.engagement);
  
      const bestDay = statsWithEngagement[0];
      const worstDay = statsWithEngagement[statsWithEngagement.length - 1];
  
      return { bestDay, worstDay };
    } catch (error) {
      console.error('Error fetching best and worst days:', error);
      return null;
    }
  }
      
  async getWeeklyFollowerGrowth(profileId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    const stats = await this.prisma.socialStats.findMany({
      where: {
        profileId,
        date: {
          gte: oneWeekAgo,
        },
      },
      orderBy: { date: 'desc' },
    });
  
    return stats.reduce((total, stat) => total + (stat.followerGrowth ?? 0), 0);
  }
  async getDailyFollowerGrowth(profileId: string, date: Date) {
    const stats = await this.prisma.socialStats.findFirst({
      where: {
        profileId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)), // Start of the day
          lt: new Date(date.setHours(23, 59, 59, 999)), // End of the day
        },
      },
      orderBy: { date: 'desc' },
    });
  
    return stats ? stats.followerGrowth : 0;
  }
    

  
  async getFacebookEngagement(accessToken: string) {
    try {
      const posts = await this.getFacebookPosts(accessToken);
      let totalLikes = 0;
      let totalComments = 0;

      posts.data.forEach(post => {
        totalLikes += post.likes?.summary?.total_count || 0;
        totalComments += post.comments?.summary?.total_count || 0;
      });

      return {
        totalLikes,
        totalComments,
        averageEngagement: posts.data.length > 0 
          ? ((totalLikes + totalComments) / posts.data.length).toFixed(1)
          : 0
      };
    } catch (error) {
      return null;
    }
  }
  
  async getInstagramEngagement(accessToken: string) {
    try {
      const media = await this.getInstagramPosts(accessToken);
      if (!media) return null;
      let totalLikes = 0;
      let totalComments = 0;

      media.data.forEach(post => {
        totalLikes += post.like_count || 0;
        totalComments += post.comments_count || 0;
      });

      return {
        totalLikes,
        totalComments,
        averageEngagement: media.data.length > 0 
          ? ((totalLikes + totalComments) / media.data.length).toFixed(1)
          : 0
      };
    } catch (error) {
      return null;
    }
  }


  async getFacebookFollowers(accessToken: string) {
    // Step 1: Get the Facebook Page linked to the user's account
    const pageResponse = await axios.get(`https://graph.facebook.com/me/accounts`, {
      params: { access_token: accessToken },
    });
  
    const pageId = pageResponse.data.data?.[0]?.id;
    if (!pageId) return { error: 'No Facebook Page found' };
  
    // Step 2: Get the followers count of the Facebook Page
    const followersResponse = await axios.get(`https://graph.facebook.com/${pageId}`, {
      params: { fields: 'followers_count', access_token: accessToken },
    });
  
    return { followers: followersResponse.data.followers_count };
  }
  


  
     
 
  
  

  async refreshToken(oldToken: string) {
    const refreshResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: { grant_type: 'fb_exchange_token', client_id: this.clientId, client_secret: this.clientSecret, fb_exchange_token: oldToken },
    });
    return refreshResponse.data.access_token;
  }























  async createScheduledPost(data: any) {
    // Find the profile that belongs to this user
    const profile = await this.prisma.profile.findFirst({
      where: { userId: data.uploadedBy }
    });
  
    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }
  
    // Create the scheduled post with the found profile ID
    return this.prisma.scheduledPost.create({
      data: {
        caption: data.caption,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType,
        platform:data.platform,
        status: 'PENDING',
        hashtags: data.hashtags,
        scheduledAt: data.scheduledAt,
        profileId: profile.id,
        uploadedBy: data.uploadedBy
      }
    });
  }
  
  async getScheduledPosts(userId: string) {
    return this.prisma.scheduledPost.findMany({
      where: { profile: { userId } },
      orderBy: { scheduledAt: 'asc' }
    });
  }
  async publishNow(postId: string) {
    // 1. Get the post with profile info
    const post = await this.prisma.scheduledPost.findUnique({
      where: { id: postId },
      include: { profile: true }
    });
  
    if (!post) throw new NotFoundException('Post not found');
    if (!post.profile.accessToken) throw new BadRequestException('Missing Instagram access token');
  
    // 2. Validate media fields before publishing
    if (post.mediaType && !post.mediaUrl) {
      throw new BadRequestException('Media URL is required when media type is specified');
    }
  
    // 3. Publish to Instagram
    try {
      const result = await this.publishToInstagramSimple(
        post.profile.accessToken,
        post.caption,
        post.mediaType && post.mediaUrl ? post.mediaUrl : undefined, // Proper null check
        post.mediaType ?? undefined
      );
  
  
      // 4. Update post status
      await this.prisma.scheduledPost.update({
        where: { id: postId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date()
        }
      });
  
      return { success: true, instagramPostId: result.id };
    } catch (error) {
      await this.prisma.scheduledPost.update({
        where: { id: postId },
        data: { status: 'FAILED' }
      });
      console.error('Instagram publish error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to publish to Instagram');
    }
  }
  
  private async publishToInstagramSimple(
    accessToken: string,
    caption: string,
    mediaUrl?: string | null,
    mediaType?: string | null
  ) {
    // Convert null to undefined
    const safeMediaUrl = mediaUrl ?? undefined;
    const safeMediaType = mediaType ?? undefined;
  
    // 1. Get Instagram Business Account ID
    const pages = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
      params: { access_token: accessToken }
    });
    
    const pageId = pages.data.data[0]?.id;
    if (!pageId) throw new Error('No Facebook Page found');
  
    const igAccount = await axios.get(`https://graph.facebook.com/v19.0/${pageId}`, {
      params: { fields: 'instagram_business_account', access_token: accessToken }
    });
  
    const igUserId = igAccount.data.instagram_business_account?.id;
    if (!igUserId) throw new Error('No Instagram Business Account linked');
  
    // 2. Validate media parameters before attempting to publish
    if (safeMediaType && !safeMediaUrl) {
      throw new Error('Media URL is required when media type is specified');
    }
  
    // 3. Upload media (if provided)
    if (safeMediaType && safeMediaUrl) {
      const isVideo = safeMediaType === 'video';
      const mediaPayload = {
        access_token: accessToken,
        caption,
        [isVideo ? 'video_url' : 'image_url']: safeMediaUrl
      };
  
      const mediaRes = await axios.post(
        `https://graph.facebook.com/v19.0/${igUserId}/media`,
        mediaPayload
      );
  
      const creationId = mediaRes.data.id;
  
      // For videos, wait for processing
      if (isVideo) {
        let status = '';
        do {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const statusCheck = await axios.get(
            `https://graph.facebook.com/v19.0/${creationId}`,
            { params: { fields: 'status', access_token: accessToken } }
          );
          status = statusCheck.data.status;
        } while (status === 'IN_PROGRESS');
        
        if (status !== 'PUBLISHED') throw new Error(`Video processing failed: ${status}`);
      }
  
      // Publish the container
      const publishRes = await axios.post(
        `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
        { creation_id: creationId, access_token: accessToken }
      );
  
      return publishRes.data;
    } else {
      // Text-only post
      const res = await axios.post(
        `https://graph.facebook.com/v19.0/${igUserId}/media`,
        { caption, access_token: accessToken }
      );
      
      const publishRes = await axios.post(
        `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
        { creation_id: res.data.id, access_token: accessToken }
      );
  
      return publishRes.data;
    }
  }

@Cron('* * * * *') // Runs every minute
async checkAndPublishScheduledPosts() {
  try {
    const now = new Date();
    console.log(`[${now.toISOString()}] Checking scheduled posts...`);

    const postsToPublish = await this.prisma.scheduledPost.findMany({
      where: {
        status: 'PENDING',
        scheduledAt: {
          lte: now
        }
      },
      include: {
        profile: true
      }
    });

    console.log(`Found ${postsToPublish.length} posts to publish`);

    for (const post of postsToPublish) {
      try {
        console.log(`Publishing post ${post.id}...`);
        await this.publishNow(post.id);
        console.log(`Successfully published post ${post.id}`);
      } catch (error) {
        console.error(`Failed to publish post ${post.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error in scheduled post check:', error);
  }
}

async publishNow(postId: string) {
}
*/

  

  
}
