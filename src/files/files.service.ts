import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async saveFileMetadata(fileData: any) {
    return this.prisma.file.create({
      data: fileData,
    });
  }
  async savePostMetadata(fileData: any) {
    return this.prisma.scheduledPost.create({
      data: fileData,
    });
  }
  async countFilesByTaskId(taskId: string) {
  return this.prisma.file.count({
    where: {
      taskId: taskId,
    },
  });
}


async getFilesByUserId(userId: string) {
  return this.prisma.file.findMany({
    where: {
      OR: [
        { uploadedBy: userId },
        {
          AcadTask: {
            course: {
              CourseMember: {
                some: {
                  userId: userId,
                },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      taskId: true,
      uploadedBy: true,
      size: true,
      type: true,
      url: true,
      name: true,
    },
  });
}

  
  async deleteFileById(fileId: string, userId: string) {
    // Only allow delete if user is the uploader
    const file = await this.prisma.file.findFirst({
      where: {
        id: fileId,
        uploadedBy: userId,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found or you are not the uploader');
    }

    // Delete the file and associated AssignedUser entries (via cascade or manually)
    return this.prisma.file.delete({
      where: {
        id: fileId,
      },
    });
  }
}

