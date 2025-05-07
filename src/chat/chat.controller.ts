import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
  BadRequestException
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(
    @Req() req: Request & { user: { id: string } },
    @Body() createChatDto: CreateChatDto
  ) {
    return this.chatService.createChat(req.user.id, createChatDto);
  }

  @Get(':id')
  async getChat(
    @Req() req: Request & { user: { id: string } },
    @Param('id') chatId: string
  ) {
    return this.chatService.getChatById(chatId, req.user.id);
  }

  @Get()
  async getUserChats(@Req() req: Request & { user: { id: string } }) {
    return this.chatService.getUserChats(req.user.id);
  }

  @Post(':id/participants')
  async addParticipants(
    @Req() req: Request & { user: { id: string } },
    @Param('id') chatId: string,
    @Body() addParticipantsDto: AddParticipantsDto
  ) {
    return this.chatService.addParticipants(chatId, req.user.id, addParticipantsDto);
  }

  @Patch(':id')
  async updateChat(
    @Req() req: Request & { user: { id: string } },
    @Param('id') chatId: string,
    @Body() updateChatDto: UpdateChatDto
  ) {
    return this.chatService.updateChat(chatId, req.user.id, updateChatDto);
  }

  @Delete(':id/participants/:userId')
  async removeParticipant(
    @Req() req: Request & { user: { id: string } },
    @Param('id') chatId: string,
    @Param('userId') userId: string
  ) {
    if (req.user.id === userId) {
      throw new BadRequestException('You cannot remove yourself from the chat');
    }
    // You would need to implement this method in ChatService
    return this.chatService.removeParticipant(chatId, req.user.id, userId);
  }

  @Delete(':id')
  async deleteChat(
    @Req() req: Request & { user: { id: string } },
    @Param('id') chatId: string
  ) {
    // You would need to implement this method in ChatService
    return this.chatService.deleteChat(chatId, req.user.id);
  }
}