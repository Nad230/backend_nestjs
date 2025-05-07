import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Request() req, @Body() data: CreateTaskDto) {
    return this.taskService.create(req.user.sub, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
  @Request() req, 
  @Param('id') projectId: string, 
  @Body() data: UpdateTaskDto
  ) {
  return this.taskService.update(req.user.sub, projectId, data);
  }

  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id') projectId: string) {
  console.log("Decoded user from JWT:", req.user);
  return this.taskService.delete(req.user.sub, projectId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('member/:id')
  getB( @Param('id') id: string) {
    return this.taskService.getTasksByMemberId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getByid(@Request() req) {
    return this.taskService.getAll(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get("/current_task")
  getAll(@Request() req) {
    return this.taskService.getCurrentTask(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Request() req, @Param('id') id: string) {
    return this.taskService.getById(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:projectId')
  getTasksByProjectId(@Request() req, @Param('projectId') projectId: string) {
    return this.taskService.getTasksByProjectId(req.user.sub, projectId);
  }


  @UseGuards(JwtAuthGuard)
  @Get('ai_suggest/:projectId')
  getTasksAi(@Request() req, @Param('projectId') projectId: string) {
    return this.taskService.getTaskAIFields(req.user.sub, projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('time_stats/:projectId')
  getTime( @Param('projectId') projectId: string) {
    return this.taskService.getProjectTimeStats( projectId);
  }


  @UseGuards(JwtAuthGuard)
  @Get('aitask_suggest/:TaskId')
  getTasksAibyid(@Request() req, @Param('TaskId') TaskId: string) {
    return this.taskService.getTaskAIFieldsByIds(req.user.sub, TaskId);
  }



  @UseGuards(JwtAuthGuard)
  @Get('progress/:TaskId')
  getTasksprogress(@Request() req, @Param('TaskId') TaskId: string) {
    return this.taskService.getTaskProgressById(TaskId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("stats/:projectId")
  getTaskstats(@Request() req,@Param('projectId') projectId: string) {
    return this.taskService.getTaskStatsWithProgress(req.user.sub,projectId);
  }


  @UseGuards(JwtAuthGuard)
  @Get("deadlines/:projectId")
  getTaskdeadline(@Request() req,@Param('projectId') projectId: string) {
    return this.taskService.getUpcomingDeadlines(projectId);
  }
}
