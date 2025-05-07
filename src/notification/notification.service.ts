// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async sendToUser(userId: string, data: { title: string; message: string }) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: NotificationType.Comment, // Ou crée un nouveau type comme WeeklySummary
        content: `${data.title}\n\n${data.message}`,
        isRead: false,
      },
    });

    // Optionnel : tu peux aussi déclencher un email, une notif push, etc.
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
