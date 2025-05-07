
import {  MessageType } from "@prisma/client";
import { CreateAttachmentDto } from "./create-attachment.dto";
import { CreateCallDto } from "./create-call.dto";

export class CreateMessageDto {
  chatId: string;
  content?: string; // For text messages
  type: MessageType  ;
  parentId?: string; // For replies
  attachment?: CreateAttachmentDto; // For media messages
  call?: CreateCallDto; // For call messages
}