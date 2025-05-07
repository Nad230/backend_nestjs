import { Controller, Get, Param, Patch } from '@nestjs/common';
import { InferenceService } from './inference.service';
import { CreatorService } from 'src/creator/creator.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('inference')
export class InferenceController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly inferenceService: InferenceService,
      ) {}
    
      @Get(':profileId/latest')
      async getLatestStats(@Param('profileId') profileId: string) {
        return this.prisma.socialStats.findFirst({
          where: { profileId },
          orderBy: { date: 'desc' },
        });
      }
    
      @Patch(':profileId/infer')
      async inferDemographics(@Param('profileId') profileId: string) {
        await this.inferenceService.estimateDemographics(profileId);
        return { message: 'Demographics inferred successfully' };
      }
    }
    