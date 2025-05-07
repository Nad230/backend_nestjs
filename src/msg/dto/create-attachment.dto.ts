// src/messages/dto/create-message.dto.ts
import { AttachmentType } from '@prisma/client';

export class CreateAttachmentDto {
  url: string;
  type: AttachmentType;  // Use the enum here
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  duration?: number;
}