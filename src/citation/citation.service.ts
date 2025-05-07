import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCitationDto } from './dto/create-citation.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CitationService {
  constructor(private prisma: PrismaService) {}

  async createCitation(dto: CreateCitationDto, userId: string) {
    return this.prisma.citation.create({
      data: {
        title: dto.title,
        authors: Array.isArray(dto.authors) ? dto.authors : [dto.authors],
        year: dto.year ? dto.year.toString() : '', // fallback to empty string if undefined
        journal: dto.journal,
        doi: dto.doi,
        taskId: dto.taskId,
        citedIn: dto.citedIn,
        tags: dto.tags,
        userId: userId,
      },
    });
  }
  async getAllCitations() {
    return this.prisma.citation.findMany();
  }

  // ✅ Get citation by ID
  async getCitationById(id: string) {
    const citation = await this.prisma.citation.findUnique({
      where: { id },
    });

    if (!citation) throw new NotFoundException('Citation not found');
    return citation;
  }

  // ✅ Get citations by Task ID
  async getCitationsByTaskId(taskId: string) {
    return this.prisma.citation.findMany({
      where: { taskId },
    });
  }

  // ✅ Get citations by User ID
  async getCitationsByUserId(userId: string) {
    return this.prisma.citation.findMany({
      where: { userId },
    });
  }
}
