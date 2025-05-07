import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReactionType } from '@prisma/client';
import { CreateReactionDTO } from './dto/create-reaction.dto';
type ReactionResponse =
  | {
      id: string;
      type: ReactionType;
      userId: string;
      postId: string | null;
      commentId: string | null;
      action: 'created' | 'updated';
      message?: string; // Optional for consistency
    }
  | {
      message: string;
      action: 'deleted';
      removedId: string;
    };
@Injectable()
export class ReactionService {
  removeReaction(reactionId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  
  async reactToPost(postId: string, userId: string, data: CreateReactionDTO): Promise<ReactionResponse> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id_users: userId } });
      if (!user) throw new NotFoundException(`User ${userId} not found.`);
  
      const post = await tx.post.findUnique({ where: { id: postId } });
      if (!post) throw new NotFoundException(`Post ${postId} not found.`);
  
      const existingReaction = await tx.postReaction.findFirst({
        where: { postId, userId: user.id, commentId: null },
      });
  
      // Case 1: User already reacted with the SAME type → DELETE
      if (existingReaction?.type === data.type) {
        await tx.postReaction.delete({ where: { id: existingReaction.id } });
        return {
          message: 'Reaction removed.',
          action: 'deleted',
          removedId: existingReaction.id,
        };
      }
  
      // Case 2: User already reacted but DIFFERENT type → UPDATE
      if (existingReaction) {
        const updatedReaction = await tx.postReaction.update({
          where: { id: existingReaction.id },
          data: { type: data.type },
        });
        return {
          ...updatedReaction,
          action: 'updated',
          message: 'Reaction updated.',
        };
      }
  
      // Case 3: No existing reaction → CREATE
      const newReaction = await tx.postReaction.create({
        data: {
          type: data.type,
          userId: user.id,
          postId: post.id,
        },
      });
      return {
        ...newReaction,
        action: 'created',
        message: 'Reaction added successfully.',
      };
    });
  }
  async reactToComment(commentId: string, userId: string, data: CreateReactionDTO): Promise<ReactionResponse> {
    return this.prisma.$transaction(async (tx) => {
      // Verify user exists using id_users (but use the id for relations)
      const user = await tx.user.findUnique({
        where: { id_users: userId },
      });
      if (!user) throw new NotFoundException(`User with ID ${userId} not found.`);
  
      // Verify comment exists
      const comment = await tx.postComment.findUnique({ 
        where: { id: commentId } 
      });
      if (!comment) throw new NotFoundException(`Comment with ID ${commentId} not found.`);
  
      // Check for existing reaction
      const existingReaction = await tx.postReaction.findFirst({
        where: { 
          commentId, 
          userId: user.id, // Use user.id (primary key) not id_users
          postId: null // Ensure it's a comment reaction, not post
        },
      });
  
      // Case 1: User already reacted with the SAME type → DELETE
      if (existingReaction?.type === data.type) {
        await tx.postReaction.delete({ 
          where: { id: existingReaction.id } 
        });
        return { 
          message: 'Reaction removed.',
          action: 'deleted',
          removedId: existingReaction.id
        };
      }
  
      // Case 2: User already reacted but DIFFERENT type → UPDATE
      if (existingReaction) {
        const updatedReaction = await tx.postReaction.update({
          where: { id: existingReaction.id },
          data: { type: data.type },
        });
        return {
          ...updatedReaction,
          action: 'updated',
          message: 'Reaction updated.', // Added consistent message
        };
      }
  
      // Case 3: No existing reaction → CREATE
      const newReaction = await tx.postReaction.create({
        data: {
          type: data.type,
          userId: user.id, // Use user.id (primary key) not id_users
          commentId: comment.id,
        },
      });
      return {
        ...newReaction,
        action: 'created',
        message: 'Reaction added successfully.', // Added consistent message
      };
    });
  }
  
 

  async getReactionCountsWithComments(postId: string) {
    // Fetch all comments for the post
    const comments = await this.prisma.postComment.findMany({
      where: { postId },
      select: { id: true, content: true },
    });

    // Fetch reaction counts for each comment
    const commentsWithReactions = await Promise.all(
      comments.map(async (comment) => {
        const reactionCount = await this.prisma.postReaction.count({
          where: { commentId: comment.id },
        });
        return {
          id: comment.id,
          content: comment.content,
          reactionCount,
        };
      }),
    );

    // Fetch reaction count for the post
    const postReactionCount = await this.prisma.postReaction.count({
      where: { postId },
    });

    // Fetch total comment count for the post
    const commentCount = await this.prisma.postComment.count({
      where: { postId },
    });

    return {
      postReactions: postReactionCount,
      commentCount: commentCount,
      comments: commentsWithReactions,
    };
  }

  async findCommentById(commentId: string) {
    return this.prisma.postComment.findUnique({
      where: { id: commentId },
    });
  }

  async findReactionById(reactionId: string) {
    return this.prisma.postReaction.findUnique({
      where: { id: reactionId },
    });
  }

  async reactToMessage(messageId: string, userId: string, data: CreateReactionDTO): Promise<ReactionResponse> {
    return this.prisma.$transaction(async (tx) => {
      // Verify user exists using id_users (but use the id for relations)
      const user = await tx.user.findUnique({
        where: { id_users: userId },
      });
      if (!user) throw new NotFoundException(`User with ID ${userId} not found.`);

      // Verify message exists
      const message = await tx.message.findUnique({ 
        where: { id: messageId } 
      });
      if (!message) throw new NotFoundException(`Message with ID ${messageId} not found.`);

      // Check for existing reaction
      const existingReaction = await tx.postReaction.findFirst({
        where: { 
          messageId, 
          userId: user.id,
          postId: null,
          commentId: null
        },
      });

      // Case 1: User already reacted with the SAME type → DELETE
      if (existingReaction?.type === data.type) {
        await tx.postReaction.delete({ 
          where: { id: existingReaction.id } 
        });
        return { 
          message: 'Reaction removed.',
          action: 'deleted',
          removedId: existingReaction.id
        };
      }

      // Case 2: User already reacted but DIFFERENT type → UPDATE
      if (existingReaction) {
        const updatedReaction = await tx.postReaction.update({
          where: { id: existingReaction.id },
          data: { type: data.type },
        });
        return {
          ...updatedReaction,
          messageId,
          action: 'updated',
          message: 'Reaction updated.',
        };
      }

      // Case 3: No existing reaction → CREATE
      const newReaction = await tx.postReaction.create({
        data: {
          type: data.type,
          userId: user.id,
          messageId: message.id,
        },
      });
      return {
        ...newReaction,
        action: 'created',
        message: 'Reaction added successfully.',
      };
    });
  }

  async getMessageReactions(messageId: string) {
    // Get all reactions for the message
    const reactions = await this.prisma.postReaction.findMany({
      where: { messageId },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            profile_photo: true
          }
        }
      }
    });

    // Count by reaction type
    const reactionCounts = await this.prisma.postReaction.groupBy({
      by: ['type'],
      where: { messageId },
      _count: { type: true }
    });

    // Format counts into a more usable object
    const countsByType = reactionCounts.reduce((acc, { type, _count }) => {
      acc[type] = _count.type;
      return acc;
    }, {} as Record<ReactionType, number>);

    return {
      total: reactions.length,
      countsByType,
      reactions
    };
  }

 async getMessageReactionCounts(messages: string[]) {
  const reactionCounts = await this.prisma.postReaction.groupBy({
    by: ['messageId'],
    where: { 
      messageId: { in: messages.filter(Boolean) } // Ensure no null/undefined
    },
    _count: { messageId: true }
  });

  return reactionCounts.reduce((acc, { messageId, _count }) => {
    if (messageId) { // Additional null check
      acc[messageId] = _count.messageId;
    }
    return acc;
  }, {} as Record<string, number>);
}
}