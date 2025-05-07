import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAcademicTaskDto } from './dto/create-academic-task.dto';
import { UpdateAcademicTaskDto } from './dto/update-academic-task.dto';
import { CreateAcademicProjectDto } from './dto/create-academic-project.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateAcadTaskDto } from './dto/create-acad-task.dto';
import { CreateTaskSubmissionDto } from './dto/create-task-submission.dto';
import { UpdateAcadTaskDto } from './dto/update-acad-task.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class AcademicService {
    constructor(private prisma: PrismaService) {}
    async createTask(createDto: CreateAcademicTaskDto, assignedById: string) {
      // 1. Check if the project exists
      const project = await this.prisma.academicProject.findUnique({
        where: { id: createDto.projectId },
      });
    
      if (!project) {
        throw new Error('Project not found'); // or throw a proper HttpException if you're using NestJS
      }
    
      // 2. Create the task
      const task = await this.prisma.academicTask.create({
        data: {
          title: createDto.title,
          projectId: createDto.projectId, // use projectId now
          assigneeId: createDto.assigneeId,
          assignedById,
          deadline: createDto.deadline ? new Date(createDto.deadline) : undefined,
          priority: createDto.priority,
          status: createDto.status,
          notes: createDto.notes,
        },
        include: {
          assignee: true,
          assignedBy: true,
          project: true, // include project info if you want
        },
      });
    
      return task;
    }
    
  async getTasksByAssignee(userId: string) {
    return this.prisma.academicTask.findMany({
      where: { assigneeId: userId },
    });
  }

  async getTasksAssignedBy(userId: string) {
    return this.prisma.academicTask.findMany({
      where: { assignedById: userId },
    });
  }



  async deleteTask(taskId: string, userId: string) {
    const task = await this.prisma.academicTask.findFirst({
      where: {
        id: taskId,
        assignedById: userId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    return this.prisma.academicTask.delete({
      where: { id: taskId },
    });
  }

  // Get task count for a specific user (assignee)
  async countTasksByUser(userId: string) {
    return this.prisma.academicTask.count({
      where: { assigneeId: userId },
    });
  }

  // Get count of tasks grouped by status
  async countTasksByStatus(userId: string) {
    const statuses = await this.prisma.academicTask.groupBy({
      by: ['status'],
      where: { assigneeId: userId },
      _count: { status: true },
    });

    return statuses.map(s => ({
      status: s.status,
      count: s._count.status,
    }));
  }

  // Optional: Get inferred progress based on status
  getProgressFromStatus(status: string): number {
    switch (status.toLowerCase()) {
      case 'todo':
        return 0;
      case 'in progress':
        return 50;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  }



  /*/////////////////////////////////////////////////////////////////////////////////*/
  async create(createDto: CreateAcademicProjectDto, userId: string) {
    // 1. Check if the user exists (you can modify this according to your use case, for example, checking the user in the database)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error('User not found'); // Or use a proper HttpException in NestJS
    }
  
    // 2. Create the academic project
    const project = await this.prisma.academicProject.create({
      data: {
        name: createDto.name,
        vibe: createDto.vibe,
        purpose: createDto.purpose,
        vision: createDto.vision,
        firstMove: createDto.firstMove,
        theme: createDto.theme,
        frequency: createDto.frequency,
        spirit: createDto.spirit,
        userId: userId, // Ensure the userId is properly linked to the project
      },
    });
  
    return project;
  }
  

  async findAllByUser(userId: string) {
    return this.prisma.academicProject.findMany({
      where: { userId },
      include: {
        AcademicTask: true,
      },
    })
  }

  async findOne(projectId: string) {
    const project = await this.prisma.academicProject.findUnique({
      where: { id: projectId },
      include: {
        AcademicTask: true,
      },
    })
    if (!project) {
      throw new NotFoundException('Project not found')
    }
    return project
  }

  

  async remove(projectId: string) {
    return this.prisma.academicProject.delete({
      where: { id: projectId },
    })
  }




  /*//////////////////////////////////////////////////////////*/
  async createCourse(dto: CreateCourseDto, userId: string) {
    return await this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        coverImage: dto.coverImage,
        visibility: dto.visibility,
        createdById: userId,
  
        CourseMember: dto.memberIds
          ? {
              create: dto.memberIds.map((memberId) => ({
                user: { connect: { id: memberId } },
              })),
            }
          : undefined,
  
        tags: dto.tagNames
          ? {
              create: dto.tagNames.map((name) => ({ name })),
            }
          : undefined,
      },
      include: {
        CourseMember: true,
        tags: true,
      },
    });
  }
  
  
  
  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        CourseMember: { include: { user: true } },
        tags: true,
      },
    });
  }
  
  async getCourseById(courseId: string) {
    return this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        CourseMember: { include: { user: true } },
        tags: true,
        rooms: true,
        tasks: true,
      },
    });
  }
  
  async getCoursesByUserId(userId: string) {
    return this.prisma.course.findMany({
      where: {
        OR: [
          { createdById: userId },
          {
            CourseMember: {
              some: { userId: userId },
            },
          },
        ],
      },
      include: {
        CourseMember: { include: { user: true } },
        tags: true,
        rooms: true,
        tasks: true,
      },
    });
  }
  
  async getMemberCourses(roomId: string) {
    return this.prisma.roomMember.count({
      where: { roomId: roomId }
    });
  }
  async updateCourse(courseId: string, dto: UpdateCourseDto) {
    const { coverImage, memberIds, rating } = dto;
  
    const updateData: any = {};
  
    if (coverImage !== undefined) {
      updateData.coverImage = coverImage;
    }
  
    if (rating !== undefined) {
      updateData.rating = rating;
    }
  
    // Update course fields (rating, coverImage)
    const course = await this.prisma.course.update({
      where: { id: courseId },
      data: updateData,
    });
  
    // Add or remove course members
    if (memberIds && memberIds.length > 0) {
      for (const userId of memberIds) {
        const existing = await this.prisma.courseMember.findFirst({
          where: { courseId, userId },
        });
  
        if (existing) {
          // Remove if already a member
          await this.prisma.courseMember.delete({
            where: { id: existing.id },
          });
        } else {
          // Add if not yet a member
          await this.prisma.courseMember.create({
            data: {
              courseId,
              userId,
            },
          });
        }
      }
    }
  
    return course;
  }
  
  


  async deleteCourse(courseId: string) {
    return this.prisma.course.delete({
      where: { id: courseId },
    });
  }




  /*//////////////////////////////////////////////////////////////////////////////////*/
  async createRoom(dto: CreateRoomDto, userId: string) {
    const roomData: any = {
      name: dto.name,
      type:dto.type,
      description: dto.description,
      visibility: dto.visibility ?? 'PUBLIC',
      status:dto.status,
      createdById: userId,
      members: {
        create: {
          user: { connect: { id: userId } },
          role: 'OWNER',
        },
      },
    };
  
    // Check if courseId is provided, if so, connect the course
    if (dto.courseId) {
      roomData.courseId = dto.courseId;
    }
    
  
    return this.prisma.room.create({
      data: roomData,
      include: {
        members: true,
      },
    });
  }
  
  async getAllRooms() {
    return this.prisma.room.findMany({
      include: {
        members: { include: { user: true } },
        course: true,
      },
    });
  }

  async updateRoomStatus(roomId: string, status: boolean) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { status }, // ✅ Now status is boolean
      include: {
        members: { include: { user: true } },
        course: true,
      },
    });
  }
  
  
  async getRoomById(userId: string) {
    return this.prisma.room.findMany({
      where: {
        OR: [
          { createdById: userId },
          {
            members: {
              some: { userId: userId },
            },
          },
          {
            course: {
              CourseMember: {
                some: { userId: userId },
              },
            },
          },
        ],
      },
      include: {
        members: { include: { user: true } },
        course: {
          include: {
            CourseMember: { include: { user: true } },
          },
        },
      },
    });
  }
  

 

  async deleteRoom(roomId: string) {
    return this.prisma.room.delete({
      where: { id: roomId },
    });
  }

  async joinRoom(roomId: string, userId: string) {
    return this.prisma.roomMember.create({
      data: {
        roomId,
        userId,
        role: 'MEMBER',
      },
    });
  }


  /************************************************************** */
  async createAcadTask(dto: CreateAcadTaskDto, createdById: string) {
    // Destructure to extract courseId separately, then prepare our data object
    const { courseId, ...data } = dto;
    const taskData: any = {
      title: data.title,
      description: data.description,
      deadline: new Date(data.deadline), // Convert string to Date if necessary
      tags: data.tags,
      isClosed: data.isClosed ?? false, 
      maxPoints:data.maxPoints, // default is false
      createdById,
    };

    // If a courseId is provided, add the connect clause; otherwise, do not include the course field
    if (courseId) {
      taskData.courseId = courseId;
    }
    

    return this.prisma.acadTask.create({
      data: taskData,
      include: {
        submissions: true,  // include submissions if you need them immediately
      },
    });
  }// Get all tasks
async getAllacadTasks() {
  return this.prisma.acadTask.findMany({
    include: {
      submissions: true,
    },
  });
}

// Get tasks by courseId (only if courseId is provided)
async getTasksByCourseId(courseId: string) {
  const whereClause = courseId === 'null' ? { courseId: null } : { courseId };
  return this.prisma.acadTask.findMany({
    where: whereClause,
    include: {
      submissions: true,
    },
  });
}
async getOpenTasksByCourseId(courseId: string) {
  const whereClause = courseId === 'null'
    ? { courseId: null, isClosed: false }
    : { courseId, isClosed: false };

  return this.prisma.acadTask.findMany({
    where: whereClause,
    include: {
      submissions: true,
    },
  });
}


async updateAcadTask(taskId: string, dto: UpdateAcadTaskDto) {
  const existing = await this.prisma.acadTask.findUnique({
    where: { id: taskId },
  });

  if (!existing) {
    throw new Error('Task not found');
  }

  const { courseId, ...data } = dto;

  const updateData: any = {
    deadline: data.deadline ? new Date(data.deadline) : undefined,
    isClosed: data.isClosed ?? false,
  };

  if (courseId === null || courseId === 'null') {
    updateData.courseId = null;
  } else if (courseId) {
    updateData.courseId = courseId;
  }

  return this.prisma.acadTask.update({
    where: { id: taskId },
    data: updateData,
    include: {
      submissions: true,
    },
  });
}


async countCourseMembers(courseId: string): Promise<number> {
  const count = await this.prisma.courseMember.count({
    where: {
      courseId,
    },
  });
  return count;
}


  


  /*////////////////////////////////////////////////////////////////////*/
  async createTaskSubmission(dto: CreateTaskSubmissionDto, owenrid:string,studentId: string) {
    return this.prisma.taskSubmission.create({
      data: {
        task: { connect: { id: dto.taskId } },
        student: { connect: { id: studentId } },
        file: { connect: { id: dto.fileId } },
        grade: dto.grade,
        feedback: dto.feedback,
        points: dto.points,
      },
      include: {
        file: true,
        task: true,
      },
    });
  }
}



