import { Injectable, BadRequestException, NotFoundException, ConflictException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { UpdateChatDto } from './dto/update-chat.dto';


@Injectable()
export class ChatService {
  // Create the chat
  removeParticipant(chatId: string, id: string, userId: string) {
    throw new Error('Method not implemented.');
  }

  
  constructor(private readonly prisma: PrismaService) {}

  async createChat(creatorId: string, createChatDto: CreateChatDto) {
    const { participantIds, name, isGroup } = createChatDto;
    
    // Validate participants
    if (!isGroup && participantIds.length !== 1) {
      throw new BadRequestException('Direct chat must have exactly one participant');
    }

    if (isGroup && !name) {
      throw new BadRequestException('Group chats must have a name');
    }

    // Check if creator is included in participants (should be for groups)
    const allParticipants = [...new Set([creatorId, ...participantIds])];
    
    // Check if users exist
    const users = await this.prisma.user.findMany({
      where: { id: { in: allParticipants } },
      select: { id: true }
    });

    if (users.length !== allParticipants.length) {
      throw new NotFoundException('One or more users not found');
    }

    // For direct chats, check if chat already exists
    if (!isGroup) {
      const existingChat = await this.prisma.chat.findFirst({
        where: {
          isGroup: false,
          users: {
            every: {
              userId: { in: allParticipants }
            }
          }
        },
        include: {
          users: {
            select: { userId: true }
          }
        }
      });

      if (existingChat) {
        const existingUserIds = existingChat.users.map(u => u.userId);
        if (
          existingUserIds.length === allParticipants.length &&
          existingUserIds.every(id => allParticipants.includes(id))
        ) {
          throw new ConflictException('Direct chat already exists');
        }
      }
    }

    // Create the chat
    return this.prisma.chat.create({
      data: {
        name: isGroup ? name : null,
        isGroup,
        admin: isGroup ? { connect: { id: creatorId } } : undefined,
        users: {
          create: allParticipants.map(userId => ({
            user: { connect: { id: userId } }
          }))
        }
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                fullname: true,
                profile_photo: true
              }
            }
          }
        }
      }
    });
  }

  async addParticipants(chatId: string, requesterId: string, addParticipantsDto: AddParticipantsDto) {
    const { userIds } = addParticipantsDto;

    // Check if chat exists and requester is admin
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        users: {
          select: { userId: true }
        },
        admin: {
          select: { id: true }
        }
      }
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.isGroup && chat.admin?.id !== requesterId) {
      throw new ForbiddenException('Only group admin can add participants');
    }

    // Check if users exist
    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true }
    });

    if (existingUsers.length !== userIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    // Check if users are already in the chat
    const existingParticipants = chat.users.map(u => u.userId);
    const newParticipants = userIds.filter(id => !existingParticipants.includes(id));

    if (newParticipants.length === 0) {
      throw new BadRequestException('All users are already in the chat');
    }

    // Add participants
    return this.prisma.chat.update({
      where: { id: chatId },
      data: {
        users: {
          create: newParticipants.map(userId => ({
            user: { connect: { id: userId } }
          }))
        }
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                fullname: true,
                profile_photo: true
              }
            }
          }
        }
      }
    });
  }

  async getChatById(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                id_users: true,
                fullname: true,
                profile_photo: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!chat) throw new NotFoundException('Chat not found');
    
    const isParticipant = chat.users.some(u => u.user.id === userId);
    if (!isParticipant) throw new ForbiddenException('Access to chat denied');

    return chat;
  }

  async getUserChats(userId: string) {
    return this.prisma.chat.findMany({
      where: { users: { some: { userId } } },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                id_users: true,
                fullname: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            type: true,
            status: true,
            senderId: true,
            chatId: true,
            createdAt: true,
            updatedAt: true,
            deletedForEveryone: true // Now safe to include
          }
        }
      }
    });
  }
  async updateChat(chatId: string, requesterId: string, updateChatDto: UpdateChatDto) {
    // First check if chat exists and requester is admin
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      select: { 
        id: true,
        isGroup: true,
        adminId: true 
      }
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.isGroup && chat.adminId !== requesterId) {
      throw new ForbiddenException('Only group admin can update chat');
    }

    return this.prisma.chat.update({
      where: { id: chatId },
      data: updateChatDto,
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                fullname: true,
                profile_photo: true
              }
            }
          }
        }
      }
    });
  }
  async deleteChat(chatId: string, userId: string) {
    try {
      // 1. Verify chat exists and get participants
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          users: { select: { userId: true } },
          admin: { select: { id: true } }
        }
      });
  
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
  
      // 2. Authorization
      const isParticipant = chat.users.some(u => u.userId === userId);
      const isAdmin = chat.isGroup && chat.admin?.id === userId;
  
      if (!isParticipant && !isAdmin) {
        throw new ForbiddenException('Not authorized to delete this chat');
      }
  
      // 3. Use transaction to safely delete all related records
      return await this.prisma.$transaction(async (prisma) => {
        // Delete all messages first
        await prisma.message.deleteMany({
          where: { chatId }
        });
  
        // Delete all user-chat associations
        await prisma.userChat.deleteMany({
          where: { chatId }
        });
  
        // Delete all reactions associated with messages in this chat
        await prisma.postReaction.deleteMany({
          where: { 
            message: { chatId } 
          }
        });
  
        // Finally delete the chat
        return await prisma.chat.delete({
          where: { id: chatId }
        });
      });
  
    } catch (error) {
      console.error('Delete chat error:', error);
      throw new InternalServerErrorException('Failed to delete chat');
    }
  }
}