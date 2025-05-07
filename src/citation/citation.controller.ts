import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CitationService } from './citation.service';
import { CreateCitationDto } from './dto/create-citation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('citation')
export class CitationController {
  constructor(private readonly citationService: CitationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateCitationDto) {
    return this.citationService.createCitation(dto, req.user.sub);
  }

  // ✅ Get all citations
  @Get()
  getAll() {
    return this.citationService.getAllCitations();
  }

  // ✅ Get citation by ID
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.citationService.getCitationById(id);
  }

  // ✅ Get citations by Task ID
  @Get('task/:taskId')
  getByTaskId(@Param('taskId') taskId: string) {
    return this.citationService.getCitationsByTaskId(taskId);
  }

  // ✅ Get citations by User ID
  @Get('user/:userId')
  getByUserId(@Param('userId') userId: string) {
    return this.citationService.getCitationsByUserId(userId);
  }
}
