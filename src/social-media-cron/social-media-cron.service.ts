/*import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreatorService } from 'src/creator/creator.service';

@Injectable()
export class SocialMediaClonService {
  private readonly logger = new Logger(SocialMediaClonService.name);

  constructor(private readonly creatorService: CreatorService) {}

  // Runs every night at 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async updateSocialStats() {
    this.logger.log('🔄 Running daily social media stats update...');

    // Fetch all users who have linked social media accounts
    // (Assuming you store access tokens in the database)
    const users = await this.getAllUsersWithTokens();

    for (const user of users) {
      const { id, accessToken } = user;

      // Fetch and update Facebook followers & engagement
      const fbFollowers = await this.creatorService.getFacebookFollowers(accessToken);
      const fbEngagement = await this.creatorService.getFacebookEngagement(accessToken);

      // Fetch and update Instagram followers & engagement
      const igFollowers = await this.creatorService.getInstagramFollowers(accessToken);
      const igEngagement = await this.creatorService.getInstagramEngagement(accessToken);

      // Save stats in the database
      await this.creatorService.saveSocialStats(id, fbFollowers?.followers, fbEngagement?.totalLikes, fbEngagement?.totalComments);
      await this.creatorService.saveSocialStats(id, igFollowers?.followers, igEngagement?.totalLikes, igEngagement?.totalComments);

      this.logger.log(`✅ Updated stats for user: ${id}`);
    }
  }

  // Example function to fetch users with access tokens (you should replace this with your database logic)
  private async getAllUsersWithTokens() {
    return [
      { id: 'user1', accessToken: 'example_token_1' },
      { id: 'user2', accessToken: 'example_token_2' },
    ];
  }
}
*/