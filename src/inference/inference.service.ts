import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocialStats } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class InferenceService {
  constructor(private readonly prisma: PrismaService) {}

  async estimateDemographics(profileId: string): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: { 
        username: true,
        accessToken: true
      },
    });
  
    if (!profile?.accessToken) return;
  
    const commentersData = await this.getInstagramCommentersDetailed(profile.accessToken);
    const commenters = (commentersData as unknown as { commenters: any[] })?.commenters || [];
  
    const socialStats = await this.prisma.socialStats.findMany({
      where: { profileId },
      orderBy: { date: 'desc' },
      take: 1,
    });
  
    if (!socialStats.length) return;
    const latestStats = socialStats[0];
  
    const estimatedGender = await this.estimateGenderFromCommenters(commenters);
    const estimatedAgeGroup = this.estimateAgeGroupFromCommenters(commenters, latestStats);
    const estimatedCountry = this.estimateCountryFromCommenters(commenters);
  
    await this.prisma.socialStats.update({
      where: { id: latestStats.id },
      data: {
        estimatedGender,
        estimatedAgeGroup,
        estimatedCountry,
      },
    });
  }
  
  // Add back the original age group estimation
  private estimateAgeGroup(stats: SocialStats): string {
    if (stats.likes && stats.likes > 100) return '18-24';
    if (stats.comments && stats.comments > 20) return '25-34';
    if (stats.followers && stats.followers > 500) return '35-44';
    return '45+';
  }
  
  // Update the commenters-based estimation with null checks
  private estimateAgeGroupFromCommenters(commenters: any[], stats: SocialStats): string {
    if (commenters.length === 0) return this.estimateAgeGroup(stats);
  
    const avgFollowers = commenters.reduce((sum, c) => sum + (c.followers_count || 0), 0) / commenters.length;
    const avgMedia = commenters.reduce((sum, c) => sum + (c.media_count || 0), 0) / commenters.length;
  
    if (avgMedia > 100 || avgFollowers > 10000) return '18-24';
    if ((stats.comments ?? 0) > 50 || avgFollowers > 5000) return '25-34';
    if ((stats.followers ?? 0) > 1000 || avgFollowers > 1000) return '35-44';
    return '45+';
  }
  // New: Gender estimation from commenters' data
  private async estimateGenderFromCommenters(commenters: any[]): Promise<string> {
    if (commenters.length === 0) return 'unknown';

    const genderCounts = { male: 0, female: 0 };
    const genderKeywords = {
      female: ['woman', 'girl', 'queen', 'mrs', 'female', '♀'],
      male: ['man', 'boy', 'king', 'mr', 'male', '♂']
    };

    for (const commenter of commenters) {
      const text = `${commenter.username} ${commenter.biography || ''}`.toLowerCase();
      
      // Check biography and username for gender indicators
      const foundFemale = genderKeywords.female.some(kw => text.includes(kw));
      const foundMale = genderKeywords.male.some(kw => text.includes(kw));

      if (foundFemale) genderCounts.female++;
      if (foundMale) genderCounts.male++;
    }

    // Return majority gender if clear pattern
    if (genderCounts.female > genderCounts.male * 2) return 'female';
    if (genderCounts.male > genderCounts.female * 2) return 'male';
    
    // Fallback to API prediction using most active commenter
    try {
      const mainCommenter = commenters.reduce((a, b) => 
        (b.followers_count || 0) > (a.followers_count || 0) ? b : a
      );
      const response = await axios.get(`https://api.genderize.io`, {
        params: { name: mainCommenter.username.replace(/[^a-z]/g, '') },
      });
      return response.data.gender || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  // Enhanced age group estimation using commenters' metrics
  
  // Country estimation from commenters' bios and usernames
  private estimateCountryFromCommenters(commenters: any[]): string {
    const countryCodes: { [key: string]: string } = {
      fr: 'France', tn: 'Tunisia', dz: 'Algeria', ma: 'Morocco',
      es: 'Spain', us: 'USA', ca: 'Canada', tr: 'Turkey',
      de: 'Germany', it: 'Italy', jp: 'Japan', sa: 'Saudi Arabia'
    };

    const countryCounts: { [key: string]: number } = {};

    for (const commenter of commenters) {
      const text = `${commenter.username} ${commenter.biography || ''}`.toLowerCase();
      
      // Check for country flags and codes
      for (const [code, country] of Object.entries(countryCodes)) {
        if (text.includes(`_${code}`) || text.includes(`${code}_`) || 
            text.includes(country.toLowerCase())) {
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        }
      }
    }

    // Return most frequent country
    const maxEntry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0];
    return maxEntry?.[0] || 'unknown';
  }

  // Keep original Instagram API functions with improved error handling
  private async getInstagramCommentersDetailed(accessToken: string) {
    try {
      // ... existing implementation ...
    } catch (error) {
      console.error('Failed to fetch commenters:', error.message);
      return null;
    }
  }
}