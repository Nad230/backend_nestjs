import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // Créer un commentaire ou une réponse
  async create(userId: string, postId: string, data: CreateCommentDTO) {
    if (!userId) {
      throw new Error("User ID is missing in request.");
    }
  
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id_users: userId },
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
  
    // Vérifier si le post existe
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
  
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  
    // Créer le commentaire
    return this.prisma.postComment.create({
      data: {
        content: data.content,
        authorId: user.id, // Utiliser l'ID de l'utilisateur trouvé
        postId: post.id, // Utiliser l'ID du post trouvé
        parentId: data.parentId, // `parentId` est optionnel
      },
      include: {
        author: true, // Inclure les informations de l'utilisateur dans la réponse
      },
    });
  }

  // Mettre à jour un commentaire
  async update(id: string, updateCommentDTO: UpdateCommentDTO) {
    return this.prisma.postComment.update({
      where: { id },
      data: {
        content: updateCommentDTO.content,
      },
    });
  }

  // Supprimer un commentaire
  async delete(id: string) {
    return this.prisma.postComment.delete({
      where: { id },
    });
  }

  // Récupérer un commentaire par son ID
  async findOne(id: string) {
    return this.prisma.postComment.findUnique({
      where: { id },
      include: {
        author: true,
        reactions: true,
        replies: {
          include: {
            author: true,
            reactions: true,
          },
        },
      },
    });
  }

 
  async findByPost(postId: string) {
    const comments = await this.prisma.postComment.findMany({
      where: { postId }, 
      include: {
        author: true, 
        reactions: true,
        replies: {
          include: {
            author: true, // Inclure l'auteur de la réponse
            reactions: true, // Inclure les réactions de la réponse
          },
        },
      },
    });
  
    return comments.map(comment => ({
      ...comment,
      reactionCount: comment.reactions.length, 
      replies: comment.replies.map(reply => ({
        ...reply,
        reactionCount: reply.reactions.length, 
      })),
    }));
  }
  

  // Récupérer les réponses d'un commentaire
  async findReplies(parentId: string) {
    return this.prisma.postComment.findMany({
      where: { parentId },
      include: {
        author: true,
        reactions: true,
      },
    });
  }
}