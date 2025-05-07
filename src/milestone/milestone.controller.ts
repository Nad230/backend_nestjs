// src/milestone/milestone.controller.ts
import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { MilestoneService } from './milestone.service';
  import { CreateMilestoneDto } from './dto/create-milestone.dto';
  import { UpdateMilestoneDto } from './dto/update-milestone.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('milestones')
  @UseGuards(JwtAuthGuard)
  export class MilestoneController {
    constructor(private readonly milestoneService: MilestoneService) {}
  
    @Post()
    create(@Request() req, @Body() dto: CreateMilestoneDto) {
      return this.milestoneService.create(req.user.sub, dto);
    }
  
    @Get()
    getAll(@Request() req) {
      return this.milestoneService.getAll(req.user.sub);
    }
    @Get('member/:id')
    getB( @Param('id') id: string) {
      return this.milestoneService.getMilestonesByMemberId(id);
    }
  
    @Get('/project/:projectId')
    async getByProject(
      @Param('projectId') projectId: string,
      @Request() req // Get user from context
    ) {
      const userId = req.user.sub; // Ensure auth middleware sets this
      return this.milestoneService.getByProject(userId, projectId);
    }
    
    @Get(':id')
    getById(@Request() req, @Param('id') id: string) {
      return this.milestoneService.getById(req.user.sub, id);
    }
  
    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateMilestoneDto) {
      return this.milestoneService.update(req.user.sub, id, dto);
    }
  
    @Delete(':id')
    delete(@Request() req, @Param('id') id: string) {
      return this.milestoneService.delete(req.user.sub, id);
    }


    @UseGuards(JwtAuthGuard)
    @Get('progress/:milestoneId')
    getTasksprogress(@Request() req, @Param('milestoneId') milestoneId: string) {
      return this.milestoneService.getMilestoneProgress(milestoneId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("stats/:projectId")
    getproject(@Request() req,@Param('projectId') projectId: string) {
      return this.milestoneService.getMilestoneStats(req.user.sub,projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('project/:projectId/stats')
    getMilestoneAndTaskStats(
      @Request() req,
      @Param('projectId') projectId: string
    ) {
      return this.milestoneService.getProjectMilestoneAndTaskStats( projectId);
    }

  }


