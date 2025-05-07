import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Query,
  NotFoundException,
  Put,
  Patch,
} from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateAcademicTaskDto } from './dto/create-academic-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateAcademicProjectDto } from './dto/create-academic-project.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateAcadTaskDto } from './dto/create-acad-task.dto';
import { CreateTaskSubmissionDto } from './dto/create-task-submission.dto';
import { UpdateAcadTaskDto } from './dto/update-acad-task.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('academic')
export class AcademicController {
  constructor(private readonly taskService: AcademicService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateAcademicTaskDto, @Request() req) {
    const assignedById = req.user.sub;
    return this.taskService.createTask(dto, assignedById);
  }
  @UseGuards(JwtAuthGuard)
  @Post('room')
  async createRoom(@Body() dto: CreateRoomDto, @Request() req) {
    const assignedById = req.user.sub;
    return this.taskService.createRoom(dto, assignedById);
  }

  
  
  @UseGuards(JwtAuthGuard)
  @Post('courses')
  async createCourse(@Body() dto: CreateCourseDto, @Request() req) {
    const assignedById = req.user.sub;
    return this.taskService.createCourse(dto, assignedById);
  }
  @UseGuards(JwtAuthGuard)
  @Post('acadTask')
  async createAcadTask(@Body() dto: CreateAcadTaskDto, @Request() req) {
    const assignedById = req.user.sub;
    return this.taskService.createAcadTask(dto, assignedById);
  }
  @UseGuards(JwtAuthGuard)
  @Post('subTask')
  async subTask(@Body() dto: CreateTaskSubmissionDto, @Request() req) {
    const assignedById = req.user.sub;
    const studentId = dto.studentId; // explicitly sent in body

    return this.taskService.createTaskSubmission(dto, assignedById,studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('project')
  async createProject(@Body() dto: CreateAcademicProjectDto, @Request() req) {
    const userId = req.user.sub;
    return this.taskService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/assigned-to-me')
  async getTasksByAssignee(@Request() req) {
    return this.taskService.getTasksByAssignee(req.user.sub);
  }




  @UseGuards(JwtAuthGuard)
  @Get('courses/by-me')
  async getcourseByme(@Request() req) {
    return this.taskService.getCoursesByUserId(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('tasks/assigned-by-me')
  async getTasksAssignedBy(@Request() req) {
    return this.taskService.getTasksAssignedBy(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('task/:taskId')
  async deleteTask(@Param('taskId') taskId: string, @Request() req) {
    return this.taskService.deleteTask(taskId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/count')
  async countMyTasks(@Request() req) {
    return this.taskService.countTasksByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/status-count')
  async countTasksByStatus(@Request() req) {
    return this.taskService.countTasksByStatus(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('projects')
  async getAllProjects(@Request() req) {
    return this.taskService.findAllByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:projectId')
  async getProject(@Param('projectId') projectId: string) {
    return this.taskService.findOne(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('project/:projectId')
  async deleteProject(@Param('projectId') projectId: string) {
    return this.taskService.remove(projectId);
  }


  @Put('course/:id')
  async updateCourse(
    @Param('id') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.taskService.updateCourse(courseId, dto);
  }



  @Get("acadTask/:courseId")
  async getTasksByCourse(@Param('courseId') courseId: string) {
    return this.taskService.getTasksByCourseId(courseId);
  }

  @Get("members/:courseId")
  async getMmebersByCourse(@Param('courseId') courseId: string) {
    return this.taskService.countCourseMembers(courseId);
  }
  @Get("acadopenTask/:courseId")
  async getopenTasksByCourse(@Param('courseId') courseId: string) {
    return this.taskService.getOpenTasksByCourseId(courseId);
  }
  @Get("acadTask")
  async getAllTasks() {
    return this.taskService.getAllacadTasks();
  }
  @Put('updateTask/:taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateAcadTaskDto,
  ) {
    return this.taskService.updateAcadTask(taskId, dto);
  }




  @UseGuards(JwtAuthGuard)
  @Get('rooms/by-me')
  async getroomsByme(@Request() req) {
    return this.taskService.getRoomById(req.user.sub);
  }
  @Get("members/:roomId")
  async getMmembersByCourse(@Param('roomId') roomId: string) {
    return this.taskService.getMemberCourses(roomId);
  }



  @Patch('status/:id')
updateRoomStatus(@Param('id') id: string, @Body('status') status: boolean) {
  return this.taskService.updateRoomStatus(id, status);
}

}
  
  

