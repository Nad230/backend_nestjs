// src/post/controllers/post.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards, UseInterceptors,
  UploadedFiles, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
@UseGuards(JwtAuthGuard) 
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: './uploads',

      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + extname(file.originalname)); // Générer un nom unique
      },
    }),
  }))

  create(
    @Req() req: Request & { user: { id_users: string } }, // Extraire l'ID utilisateur de la requête
    @Body() createPostDTO: CreatePostDTO,
    @UploadedFiles() files: Express.Multer.File[], // Accéder aux fichiers uploadés
  ) {
    const authorId = req.user.id_users; // Extraire l'ID utilisateur
    return this.postService.create(authorId, createPostDTO, files); // Passer les fichiers au service
  }
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('user/:authorId')
  findByUser(@Param('authorId') authorId: string) {
    return this.postService.findByUser(authorId);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 10)) // Handle file uploads
  update(
    @Param('id') id: string,
    @Body() updatePostDTO: UpdatePostDTO, // Ensure this is correctly parsed
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    console.log("Update DTO received in controller:", updatePostDTO); // Debugging
    return this.postService.update(id, updatePostDTO, files);
  }



  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postService.delete(id);
  }
  
  @Patch(':id/share')
  incrementShareCount(@Param('id') id: string) {
    return this.postService.incrementShareCount(id);
  }
}