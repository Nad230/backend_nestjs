
import { Body, Controller, Get, Post,Request, Query, UseGuards, Req, Param } from "@nestjs/common";
import { AIService } from "./ai.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('ai')
export class AiController {
    
    constructor(private readonly aiService: AIService) {}
  
    @UseGuards(JwtAuthGuard)
     @Post('assist')
        async assistWithProject(@Request() req,@Body() projectData: { name: string; description: string }) {
        return this.aiService.assistProjectDetails(req.user.sub,projectData);
    }
    @UseGuards(JwtAuthGuard)
    @Post('/roadmap')
    async generateRoadmap(
      @Request() req,
      @Body() body: {  // Change parameter name to 'body'
        projectId: string;       // Extract projectId separately
        projectData:                 { name: string; description: string ;type: string;
      visionImpact: string;
      revenueModel: string;
      budget: string;
      timeline: string;
      teamType: string;
      team: string;

      visibility: string;
      location: string;
      status: string;
      fundingSource: string;
      tags: string[];
      collaborations: string;
      milestones: string[];
      id: string; // Ensure project ID is included
      media?: string[];
      strategyModel:string}}) {
      return this.aiService.generateProjectRoadmap(req.user.sub,
        body.projectId,  // Use extracted projectId
        body.projectData )// Pass only project data);
    }
    @UseGuards(JwtAuthGuard)
    @Post('update-milestones/:projectId')
    async updateMilestones(@Req() req, @Param('projectId') projectId: string) {
      const userId = req.user.sub; // Assuming user is authenticated
      return this.aiService.updateMilestonesWithAI(userId, projectId);
    }
    @UseGuards(JwtAuthGuard)
    @Post('update-task/:projectId')
    async updateTasks(@Req() req, @Param('projectId') projectId: string) {
      const userId = req.user.sub; // Assuming user is authenticated
      return this.aiService.updateTasksWithAI(userId, projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('suggest/:projectId')
    async Aisuggest(@Req() req, @Param('projectId') projectId: string) {
      const userId = req.user.sub; // Assuming user is authenticated
      return this.aiService.suggestBestActionsWithAI(userId, projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('suggest_task')
    async AisuggestTask(@Req() req) {
      const userId = req.user.sub; // Assuming user is authenticated
      return this.aiService.generateTaskSuggestionsWithAI(userId);
    }
}

