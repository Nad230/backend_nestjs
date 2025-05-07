import { Controller, Post, Body, Param, Put, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts/:postId/comments')
@UseGuards(JwtAuthGuard) 
export class CommentController {
  constructor(private commentService: CommentService) {}

  // Créer un commentaire ou une réponse
  @Post()
  create(
    @Req() req: Request & { user: { id_users: string } },
    @Param('postId') postId: string,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    const userId = req.user.id_users; // Extraire userId de la requête
    return this.commentService.create(userId, postId, createCommentDTO);
  }

  // Récupérer les commentaires d'un post
  @Get()
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  // Mettre à jour un commentaire
  @Put(':commentId')
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDTO: UpdateCommentDTO,
  ) {
    return this.commentService.update(commentId, updateCommentDTO);
  }

  // Supprimer un commentaire
  @Delete(':commentId')
  delete(@Param('commentId') commentId: string) {
    return this.commentService.delete(commentId);
  }

  // Récupérer un commentaire par son ID
  @Get(':commentId')
  findOne(@Param('commentId') commentId: string) {
    return this.commentService.findOne(commentId);
  }

  // Récupérer les réponses d'un commentaire
  @Get(':commentId/replies')
  findReplies(@Param('commentId') commentId: string) {
    return this.commentService.findReplies(commentId);
  }
}