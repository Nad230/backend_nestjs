import { Controller, Post, Body, Param, UseGuards, Req, Get, NotFoundException, Delete, Query } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionDTO } from './dto/create-reaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionController {
  constructor(private reactionService: ReactionService) {}

  @Post('post/:postId')
  async reactToPost(
    @Req() req: Request & { user: { id_users: string } },
    @Param('postId') postId: string,
    @Body() createReactionDTO: CreateReactionDTO,
  ) {
    const result = await this.reactionService.reactToPost(
      postId,
      req.user.id_users,
      createReactionDTO,
    );
  
    const counts = await this.reactionService.getReactionCountsWithComments(postId);
  
    return {
      ...counts,
      message: result.message, // Now shows correct action (added/updated/removed)
      reaction: result.action !== 'deleted' ? result : null,
    };
  }

  @Post('comment/:commentId')
  async reactToComment(
    @Req() req: Request & { user: { id_users: string } },
    @Param('commentId') commentId: string,
    @Body() createReactionDTO: CreateReactionDTO,
  ) {
    const result = await this.reactionService.reactToComment(
      commentId,
      req.user.id_users,
      createReactionDTO,
    );
  
    // Get the postId from the comment to fetch counts
    const comment = await this.reactionService.findCommentById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
  
    const counts = await this.reactionService.getReactionCountsWithComments(comment.postId);
  
    return {
      ...counts,
      message: result.message,
      ...(result.action === 'deleted' 
        ? { removedId: result.removedId }
        : { reaction: { id: result.id, type: result.type } }
    )};
  }

  @Get('count/details/:postId')
  async getReactionCountsWithComments(@Param('postId') postId: string) {
    return this.reactionService.getReactionCountsWithComments(postId);
  }
  @Get('message/:messageId')
 
  async getMessageReactions(@Param('messageId') messageId: string) {
    return this.reactionService.getMessageReactions(messageId);
  }

  @Get('messages/counts')
 
  async getMessagesReactionCounts(
    @Query('ids') messageIds: string[]
  ) {
    return this.reactionService.getMessageReactionCounts(messageIds);
  }

  @Delete(':reactionId')
  
  async removeReaction(
    @Req() req: Request & { user: { id_users: string } },
    @Param('reactionId') reactionId: string
  ) {
    const reaction = await this.reactionService.findReactionById(reactionId);
    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    if (reaction.userId !== req.user.id_users) {
      throw new NotFoundException('You can only remove your own reactions');
    }

    await this.reactionService.removeReaction(reactionId);

    let counts = {};
    if (reaction.postId) {
      counts = await this.reactionService.getReactionCountsWithComments(reaction.postId);
    }

    return {
      ...counts,
      message: 'Reaction removed successfully',
      removedId: reactionId
    };
  }
}