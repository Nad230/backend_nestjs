// src/messages/msg.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { MessageType, MessageStatus, CallStatus, CallType, AttachmentType } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  // Configuration du timeout des transactions
  private readonly transactionOptions = {
    maxWait: 20000, // 20 seconds
    timeout: 20000, // 20 seconds
  };

 
  async sendMessage(
    senderId: string, 
    messageId: string, 
    updateDto: UpdateMessageDto, 
    createMessageDto: CreateMessageDto
  ) {
    // Add null checks and default values
    if (!createMessageDto) {
      throw new BadRequestException('Message data is required');
    }

    const { 
      chatId = null, 
      content = null, 
      type = null, 
      parentId = null, 
      attachment = null, 
      call = null 
    } = createMessageDto;

    if (!chatId) {
      throw new BadRequestException('Chat ID is required');
    }

    if (!type) {
      throw new BadRequestException('Message type is required');
    }

    // Load chat with transaction
    return this.prisma.$transaction(async (prisma) => {
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { 
          users: {
            select: { 
              userId: true,
              user: { select: { id: true } }
            } 
          } 
        }
      });

      if (!chat) throw new NotFoundException('Chat not found');
      if (!chat.users.some(u => u.userId === senderId)) {
        throw new ForbiddenException('Not a chat member');
      }

      // Validate message content based on type
      switch (type) {
        case 'TEXT':
          if (!content) throw new BadRequestException('Text content required');
          break;
        case 'IMAGE':
        case 'VIDEO': 
        case 'AUDIO':
        case 'FILE':
          if (!attachment) throw new BadRequestException('Attachment required');
          break;
        case 'CALL':
          if (!call) throw new BadRequestException('Call data required');
          break;
        default:
          throw new BadRequestException('Invalid message type');
      }

      // Build message data
      const messageData: any = {
        content,
        type,
        status: 'DELIVERED',
        sender: { connect: { id: senderId } },
        chat: { connect: { id: chatId } },
        readReceipts: {
          create: chat.users
            .filter(user => user.userId !== senderId)
            .map(user => ({
              user: { connect: { id: user.userId } }
            }))
        }
      };

      // Add optional fields
      if (parentId) messageData.parent = { connect: { id: parentId } };
      
      if (attachment) {
        messageData.attachment = {
          create: {
            url: attachment.url,
            type: attachment.type,
            fileName: attachment.fileName,
            fileSize: attachment.fileSize,
            width: attachment.width,
            height: attachment.height,
            duration: attachment.duration
          }
        };
      }

      // Create message
      const message = await prisma.message.create({
        data: messageData,
        include: {
          attachment: true,
          readReceipts: { include: { user: true } },
          sender: { select: { id: true, fullname: true, profile_photo: true } }
        }
      });

      // Handle call if needed
      if (type === 'CALL' && call) {
        await prisma.call.create({
          data: {
            type: call.type,
            status: call.status,
            duration: call.duration || 0,
            message: { connect: { id: message.id } },
            participants: {
              create: chat.users.map(user => ({
                user: { connect: { id: user.userId } }
              }))
            }
          }
        });
      }

      await this.supabaseService.broadcastNewMessage(message.chatId, message);
      return message;
    }, this.transactionOptions);}
  

  async updateMessageStatus(messageId: string, status: MessageStatus) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { status },
      include: {
        sender: {
          select: {
            id: true,
            fullname: true
          }
        }
      }
    });
  }

  async markAsSent(messageId: string, userId: string) {
    return this.prisma.readReceipt.update({
      where: {
        userId_messageId: {
          userId,
          messageId
        }
      },
      data: {
        readAt: new Date()
      },
      include: {
        message: true,
        user: true
      }
    });
  }

  async markAsSeen(messageId: string, userId: string) {
    // Pré-charger les données avant la transaction
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        readReceipts: true,
        chat: {
          include: {
            users: {
              select: {
                userId: true
              }
            }
          }
        }
      }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Update or create the read receipt
      await prisma.readReceipt.upsert({
        where: {
          userId_messageId: {
            userId: userId,
            messageId: messageId
          }
        },
        update: {
          readAt: new Date()
        },
        create: {
          userId: userId,
          messageId: messageId,
          readAt: new Date()
        }
      });
    
      // Vérifier si tous les participants ont vu le message
      const allSeen = message.chat.users
        .filter(user => user.userId !== message.senderId)
        .every(user => 
          message.readReceipts.some(
            rr => rr.userId === user.userId && rr.readAt !== null
          )
        );

      if (allSeen) {
        const updatedMessage = await prisma.message.update({
          where: { id: messageId },
          data: { status: 'SEEN' },
          include: {
            sender: {
              select: {
                id: true,
                fullname: true
              }
            }
          }
        });
        await this.supabaseService.broadcastMessageStatus(
          updatedMessage.chatId,
          messageId,
          'SEEN'
        );
        return updatedMessage;
      }

      return message;
    }, this.transactionOptions);
  }

  async getUnseenMessages(chatId: string, userId: string) {
    return this.prisma.message.findMany({
      where: {
        chatId,
        readReceipts: {
          some: {
            userId,
            readAt: null
          }
        }
      },
      include: {
        attachment: true,
        sender: {
          select: {
            id: true,
            fullname: true,
            profile_photo: true
          }
        },
        readReceipts: {
          where: { userId },
          select: {
            readAt: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async startCall(senderId: string, chatId: string, isVideo: boolean) {
    // Pré-charger les données avant la transaction
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: { select: { userId: true } } }
    });

    if (!chat) throw new NotFoundException('Chat not found');
    if (!chat.users.some(u => u.userId === senderId)) {
      throw new ForbiddenException('Not a chat member');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Créer le Message
      const message = await prisma.message.create({
        data: {
          type: 'CALL',
          status: 'DELIVERED',
          senderId,
          chatId,
          readReceipts: {
            create: chat.users
              .filter(user => user.userId !== senderId)
              .map(user => ({ userId: user.userId }))
          }
        }
      });

      // Créer le Call
      const callType = isVideo ? 
        (chat.isGroup ? 'GROUP_VIDEO' : 'VIDEO') : 
        (chat.isGroup ? 'GROUP_VOICE' : 'VOICE');

      const call = await prisma.call.create({
        data: {
          type: callType,
          status: 'ONGOING',
          duration: 0,
          messageId: message.id,
          participants: {
            create: {
              userId: senderId,
              joinedAt: new Date()
            }
          }
        },
        include: { 
          participants: true,
          message: true 
        }
      });

      // Mettre à jour le Message avec l'ID du Call
      await prisma.message.update({
        where: { id: message.id },
        data: { call: { connect: { id: call.id } } }
      });

      return {
        message: {
          ...message,
          call
        },
        call
      };
    }, this.transactionOptions);
  }

  async endCall(callId: string, duration: number) {
    return this.prisma.call.update({
      where: { id: callId },
      data: {
        status: 'COMPLETED',
        duration,
        endedAt: new Date()
      },
      include: { message: true }
    });
  }

  async deleteMessage(userId: string, messageId: string, deleteForEveryone: boolean) {
    // Récupération du message avec toutes les relations nécessaires
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { 
        chat: { 
          include: { 
            users: true,
            admin: true 
          } 
        },
        attachment: true,
        deletions: { where: { userId } }
      }
    });

    if (!message) throw new NotFoundException('Message not found');
    if (!message.chat) throw new NotFoundException('Chat not found');

    const isSender = message.senderId === userId;
    const isAdmin = message.chat.admin?.id === userId;
    const canDeleteForEveryone = isSender || isAdmin;

    if (deleteForEveryone && !canDeleteForEveryone) {
      throw new ForbiddenException('Only sender or admin can delete for everyone');
    }

    return this.prisma.$transaction(async (prisma) => {
      if (deleteForEveryone) {
        // Suppression pour tout le monde
        const result = await prisma.message.update({
          where: { id: messageId },
          data: {
            deletedForEveryone: true,
            content: null,
            updatedAt: new Date()
          }
        });

        if (message.attachment) {
          await prisma.attachment.deleteMany({
            where: { messageId }
          });
        }

        await this.supabaseService.broadcastMessageDeleted(
          message.chatId,
          messageId,
          true
        );

        return { 
          success: true, 
          message: 'Message deleted for everyone',
          data: result
        };
      } else {
        // Suppression uniquement pour l'utilisateur courant
        if (!message.deletions.some(d => d.userId === userId)) {
          await prisma.messageDelete.create({
            data: { userId, messageId }
          });

          await this.supabaseService.broadcastMessageDeleted(
            message.chatId,
            messageId,
            false,
            userId
          );
        }

        return { 
          success: true, 
          message: 'Message deleted for you',
          data: message
        };
      }
    }, this.transactionOptions);
  }

  async getMessages(chatId: string, userId: string) {
    const deletedMessages = await this.prisma.messageDelete.findMany({
      where: { userId },
      select: { messageId: true }
    });

    const deletedMessageIds = deletedMessages.map(d => d.messageId);

    return this.prisma.message.findMany({
      where: {
        chatId,
        NOT: [
          { deletedForEveryone: true },
          { id: { in: deletedMessageIds } }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            fullname: true,
            profile_photo: true
          }
        },
        attachment: true,
        call: {
          include: {
            participants: true
          }
        },
        deletions: {
          where: { userId },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }
}