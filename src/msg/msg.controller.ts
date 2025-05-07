// src/messages/messages.controller.ts
import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Query, 
  Req, 
  UploadedFile, 
  UseGuards, 
  UseInterceptors,
  Inject, 
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MessagesService } from './msg.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AttachmentType, MessageStatus } from '@prisma/client';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(SupabaseService) private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + extname(file.originalname));
      }
    }),
    fileFilter: (req, file, cb) => {
      // Skip file processing if content-type is JSON
      if (req.headers['content-type']?.includes('application/json')) {
        return cb(null, false);
      }
      cb(null, true);
    }
  }))
  async sendMessage(
    @Req() req: Request & { user: { id: string } },
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    // Debug logging
    console.log('Received request with:', {
      headers: req.headers,
      body: createMessageDto,
      file: file?.originalname
    });
  
    // Handle file upload if present
    if (file) {
      createMessageDto.attachment = {
        url: `/uploads/${file.filename}`,
        type: this.getAttachmentType(file.mimetype),
        fileName: file.originalname,
        fileSize: file.size
      };
    }
  
    // Explicit validation for JSON requests
    if (req.headers['content-type']?.includes('application/json')) {
      if (createMessageDto.type === 'TEXT' && !createMessageDto.content) {
        throw new BadRequestException('Content is required for text messages');
      }
    }
  
    const message = await this.messagesService.sendMessage(
      req.user.id,
      `temp-${Date.now()}`,
      {} as UpdateMessageDto,
      createMessageDto
    );
    
    await this.supabaseService.broadcastNewMessage(
      createMessageDto.chatId,
      message
    );
  
    return message;
  }

  @Post('call/start')
  async startCall(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { chatId: string; isVideo: boolean }
  ) {
    const result = await this.messagesService.startCall(
      req.user.id,
      body.chatId,
      body.isVideo
    );

    await this.supabaseService.broadcastToChat(
      body.chatId,
      'call_started',
      result
    );

    return result;
  }

  @Patch('call/end/:callId')
  async endCall(
    @Param('callId') callId: string,
    @Body() body: { duration: number }
  ) {
    const endedCall = await this.messagesService.endCall(callId, body.duration);

    await this.supabaseService.broadcastToChat(
      endedCall.message.chatId,
      'call_ended',
      endedCall
    );

    return endedCall;
  }

  @Delete(':id')
  async deleteMessage(
    @Req() req: Request & { user: { id: string } },
    @Param('id') messageId: string,
    @Query('forEveryone') forEveryone: string
  ) {
    const result = await this.messagesService.deleteMessage(
      req.user.id,
      messageId,
      forEveryone === 'true'
    );

    // Find the chatId from the message
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { chatId: true }
    });

    if (message) {
      await this.supabaseService.broadcastMessageDeleted(
        message.chatId,
        messageId,
        forEveryone === 'true',
        req.user.id
      );
    }

    return result;
  }

  @Get('chat/:chatId')
  async getMessages(
    @Req() req: Request & { user: { id: string } },
    @Param('chatId') chatId: string
  ) {
    return this.messagesService.getMessages(chatId, req.user.id);
  }

  @Get('unseen/:chatId')
  async getUnseenMessages(
    @Req() req: Request & { user: { id: string } },
    @Param('chatId') chatId: string
  ) {
    return this.messagesService.getUnseenMessages(chatId, req.user.id);
  }

  @Patch('status/:messageId')
  async updateMessageStatus(
    @Param('messageId') messageId: string,
    @Body('status') status: MessageStatus
  ) {
    const updatedMessage = await this.messagesService.updateMessageStatus(messageId, status);
    
    if (updatedMessage.chatId) {
      await this.supabaseService.broadcastMessageStatus(
        updatedMessage.chatId,
        messageId,
        status
      );
    }

    return updatedMessage;
  }

  @Post('read/:messageId')
  async markAsRead(
    @Req() req: Request & { user: { id: string } },
    @Param('messageId') messageId: string
  ) {
    const result = await this.messagesService.markAsSeen(messageId, req.user.id);
    
    if (result.chatId) {
      await this.supabaseService.broadcastMessageStatus(
        result.chatId,
        messageId,
        'SEEN'
      );
    }

    return result;
  }

  @Post('typing')
  async sendTypingIndicator(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { chatId: string, isTyping: boolean }
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullname: true }
    });
    
    if (!user) {
      throw new Error('User not found');
    }

    await this.supabaseService.broadcastTyping(
      body.chatId,
      user.id,
      user.fullname,
      body.isTyping
    );
    
    return { success: true };
  }

  private getAttachmentType(mimeType: string): AttachmentType {
    if (mimeType.startsWith('image/')) return AttachmentType.Image;
    if (mimeType.startsWith('video/')) return AttachmentType.Video;
    if (mimeType.startsWith('audio/')) return AttachmentType.Audio;
    return AttachmentType.Document;
  }
}