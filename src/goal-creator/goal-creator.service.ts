import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCreatorGoalDto } from './dto/create-creator-goal.dto';
import { UpdateCreatorGoalDto } from './dto/update-creator-goal.dto';

@Injectable()
export class GoalCreatorService {
  private prisma = new PrismaClient();
  /*private milestoneTemplates = {
    content: {
      subscribers: [
        { title: 'Reach 100 subscribers (early traction)', targetValue: 100, percentage: 25 },
        { title: 'Hit 1,000 subscribers (eligible for monetization)', targetValue: 1000, percentage: 50 },
        { title: 'Reach 10,000 subscribers (build community)', targetValue: 10000, percentage: 100 }
      ],
      watchtime: [
        { title: 'Improve average watch time to 30 seconds per video', targetValue: 30, percentage: 25 },
        { title: 'Reach 50% viewer retention on most videos', targetValue: 50, percentage: 50 },
        { title: 'Achieve 4,000 watch hours (YouTube monetization)', targetValue: 4000, percentage: 100 }
      ],
      engagement: [
        { title: 'Get 50 likes per video consistently', targetValue: 50, percentage: 25 },
        { title: 'Reach 500 comments total across all videos', targetValue: 500, percentage: 50 },
        { title: 'Get 10% engagement rate on average', targetValue: 10, percentage: 100 }
      ]
    },
    influencer: {
      followers: [
        { title: 'Reach 1,000 followers', targetValue: 1000, percentage: 25 },
        { title: 'Hit 10,000 followers (unlock collaborations)', targetValue: 10000, percentage: 50 },
        { title: 'Reach 50,000 followers (establish strong influence)', targetValue: 50000, percentage: 100 }
      ],
      engagement: [
        { title: 'Get 50 comments per post', targetValue: 50, percentage: 25 },
        { title: 'Reach 10% engagement rate', targetValue: 10, percentage: 50 },
        { title: 'Have at least 5 viral posts', targetValue: 5, percentage: 100 }
      ],
      brandDeals: [
        { title: 'Get your first paid collab', targetValue: 1, percentage: 25 },
        { title: 'Secure 3+ consistent brand partnerships', targetValue: 3, percentage: 50 },
        { title: 'Earn $10,000+ from brand deals', targetValue: 10000, percentage: 100 }
      ]
    },
    ecommerce: {
      sales: [
        { title: 'Make your first sale', targetValue: 1, percentage: 25 },
        { title: 'Reach $1,000 revenue', targetValue: 1000, percentage: 50 },
        { title: 'Hit $10,000+ in sales', targetValue: 10000, percentage: 100 }
      ],
      traffic: [
        { title: 'Get 500 profile/store visits', targetValue: 500, percentage: 25 },
        { title: 'Achieve 5%+ conversion rate', targetValue: 5, percentage: 50 },
        { title: 'Reach 10,000 monthly visits', targetValue: 10000, percentage: 100 }
      ]
    },
    educator: {
      students: [
        { title: 'Get 50 students enrolled', targetValue: 50, percentage: 25 },
        { title: 'Reach 500 total enrollments', targetValue: 500, percentage: 50 },
        { title: 'Grow to 5,000+ students', targetValue: 5000, percentage: 100 }
      ],
      engagement: [
        { title: 'Get 20+ comments per post', targetValue: 20, percentage: 25 },
        { title: 'Reach 100 attendees per live session', targetValue: 100, percentage: 50 },
        { title: 'Achieve 80%+ course completion rate', targetValue: 80, percentage: 100 }
      ]
    },
    artist: {
      portfolio: [
        { title: 'Post 10 high-quality artworks', targetValue: 10, percentage: 25 },
        { title: 'Reach 1,000 profile views', targetValue: 1000, percentage: 50 },
        { title: 'Get featured on an art platform or gallery', targetValue: 1, percentage: 100 }
      ],
      commissions: [
        { title: 'Secure your first paid commission', targetValue: 1, percentage: 25 },
        { title: 'Get repeat clients (3+ returning customers)', targetValue: 3, percentage: 50 },
        { title: 'Earn $5,000+ from commissions', targetValue: 5000, percentage: 100 }
      ]
    },
    news: {
      reach: [
        { title: 'Reach 1,000 views per post', targetValue: 1000, percentage: 25 },
        { title: 'Get 5,000+ shares on your content', targetValue: 5000, percentage: 50 },
        { title: 'Reach 100,000+ monthly impressions', targetValue: 100000, percentage: 100 }
      ],
      credibility: [
        { title: 'Get mentioned by at least one reputable source', targetValue: 1, percentage: 25 },
        { title: 'Be cited in 10+ news articles', targetValue: 10, percentage: 50 },
        { title: 'Become a trusted source with 100K+ followers', targetValue: 100000, percentage: 100 }
      ]
    }
  };

  private getMilestoneTemplates(creatorType: string, goalId: string) {
    return this.milestoneTemplates[creatorType]?.[goalId] || [];
  }



  async createGoal(dto: CreateCreatorGoalDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: dto.profileId },
    });
    if (!profile) throw new NotFoundException('Profile not found');

    const milestones = this.getMilestoneTemplates(dto.creatorType, dto.goalId);
    const maxTarget = milestones.length > 0 
      ? Math.max(...milestones.map(m => m.targetValue))
      : dto.targetValue;

    return this.prisma.$transaction(async (prisma) => {
      const goal = await prisma.creatorGoal.create({
        data: {
          profileId: dto.profileId,
          creatorType: dto.creatorType,
          platform: dto.platform,
          goalId: dto.goalId,
          title: dto.title,
          description: dto.description,
          metrics: dto.metrics,
          targetValue: dto.targetValue,
          deadline: dto.deadline,
        },
      });

      if (milestones.length > 0) {
        await prisma.goalMilestone.createMany({
          data: milestones.map(m => ({
            goalId: goal.id,
            title: m.title,
            targetValue: m.targetValue,
            percentage: m.percentage,
          })),
        });
      }

      return goal;
    });
  }


  async getAllGoals() {
    return this.prisma.creatorGoal.findMany();
  }

  async getGoalById(id: string) {
    const goal = await this.prisma.creatorGoal.findUnique({
      where: { id },
    });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    return goal;
  }

  async getGoalsByProfileId(profileId: string) {
    const goals = await this.prisma.creatorGoal.findMany({
      where: { profileId },
    });
    if (!goals.length) {
      throw new NotFoundException('No goals found for this profile');
    }
    return goals;
  }
    */
}
