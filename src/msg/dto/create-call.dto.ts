import { CallStatus, CallType } from "@prisma/client";

export class CreateCallDto {
  type: CallType;
  duration?: number; // Will be set when call ends
  status: CallStatus;
}