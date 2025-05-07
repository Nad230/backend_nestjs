import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AchivementService } from './achivement.service';
import { Body, Controller,Patch, Post, UseGuards, Request, Get, BadRequestException, InternalServerErrorException, Param } from '@nestjs/common';
import { UpdateAchievementDto } from './dto/update-achivement.dto';

@Controller('achivement')
export class AchivementController {
    constructor(private readonly achievementService: AchivementService) {}


    @UseGuards(JwtAuthGuard)

    @Patch(':id')
    async updateAchievement(@Request() req,
      @Param('id') id: string
    ) {
      return this.achievementService.markAchievementAsShown(req.user.sub,id);
    }
    @UseGuards(JwtAuthGuard)

    @Get('showedStatus/:id')
    async gettshowed(@Request() req,
      @Param('id') id: string
    ) {
      return this.achievementService.getAchievementShowedStatus(req.user.sub,id);
    }
    

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllAchievements(@Request() req) {
      return this.achievementService.getUserAchievements(req.user.sub);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getAchievementById(@Param('id') id: string) {
      return this.achievementService.getAchievementById(id);
    }
    @UseGuards(JwtAuthGuard)
    @Get('user')
    async getUserAchievements(@Request() req) {
      return this.achievementService.getUserAchievements(req.user.sub);
    }
}
