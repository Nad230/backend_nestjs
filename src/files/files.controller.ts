import { Controller, Post, UploadedFile, UseInterceptors, Body, UseGuards ,Request, Delete, Get, NotFoundException, Param} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly supabaseService: SupabaseService
  ) {}
/*
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Body() body: { fileName?: string; taskId?: string },
    @Request() req // Get the authenticated request
  ) {
    const fileUrl = await this.supabaseService.uploadFile(file, 'project_files');
    
    return this.filesService.saveFileMetadata({
      name: body.fileName || file.originalname,
      url: fileUrl,
      type: file.mimetype,
      size: file.size,
      taskId: body.taskId || null,

      uploadedBy: req.user.sub // Get user ID from JWT claims
    });
  }


*/


 





  @UseGuards(JwtAuthGuard)
@Get()
async getUserFiles(@Request() req) {
  const files = await this.filesService.getFilesByUserId(req.user.sub);
  // Optionally modify or enhance the file metadata before returning it
  return files;
}
@Get('count/:taskId')
async getFileCountByTask(@Param('taskId') taskId: string) {
  const count = await this.filesService.countFilesByTaskId(taskId);
  return { count };
}



  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteFile(@Param('id') fileId: string, @Request() req) {
    try {
      return await this.filesService.deleteFileById(fileId, req.user.sub);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

