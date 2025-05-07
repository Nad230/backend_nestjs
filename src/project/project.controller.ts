// src/project/project.controller.ts
import { Controller, Post, Body, UseGuards, Request, Patch, Param, Delete, Get, NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Request() req, @Body() data: CreateProjectDto) {
    console.log("Decoded user from JWT:", req.user); // Debugging
    return this.projectService.create(req.user.sub, data);
    }


@UseGuards(JwtAuthGuard)
@Get('jwt')
async getsub(@Request() req) {
 return req.user.sub
}

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
    @Request() req, 
    @Param('id') projectId: string, 
    @Body() data: UpdateProjectDto
    ) {
    return this.projectService.update(req.user.sub, projectId, data);
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Request() req, @Param('id') projectId: string) {
    console.log("Decoded user from JWT:", req.user);
    return this.projectService.delete(req.user.sub, projectId);
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(@Request() req) {
      console.log("Decoded user from JWT:", req.user);
      return this.projectService.getAll(req.user.sub);
    }


    @UseGuards(JwtAuthGuard)
    @Get("stats")
    getproject(@Request() req) {
      console.log("Decoded user from JWT:", req.user);
      return this.projectService.getProjectStats(req.user.sub);
    }


    @UseGuards(JwtAuthGuard)
    @Get("monthly")
    getMonthgrouth(@Request() req) {
      console.log("Decoded user from JWT:", req.user);
      return this.projectService.monthlyGrowth(req.user.sub);
    }



    
    
    
    @UseGuards(JwtAuthGuard)
    @Get(':projectId')
async getProject(
  @Param('projectId') projectId: string,
  @Request() req
) {
  const userId = req.user.sub; // assuming auth middleware sets this
  const project = await this.projectService.getById(userId, projectId);
  if (!project) {
    throw new NotFoundException('Project not found');
  }
  return project; // Make sure you're returning it!
}



    @UseGuards(JwtAuthGuard)
    @Get('ai_suggest/:id')
    getAInsights(@Request() req, @Param('projectId') projectId: string) {
      return this.projectService.getProjectAIInsights(req.user.sub, projectId);
    }


    @UseGuards(JwtAuthGuard)
    @Get('progress/:projectId')
    getProjectprogress( @Param('projectId') projectId: string) {
      return this.projectService.getProjectProgressById(projectId);
    }


    @UseGuards(JwtAuthGuard)
    @Get('time_spent/:projectId')
    getprojectTime( @Param('projectId') projectId: string) {
      return this.projectService.getProjectTimeMetrics(projectId);
    }

    
}

   

    
  

