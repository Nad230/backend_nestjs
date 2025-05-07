import { IsEnum, IsString } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class CreateReactionDTO {


  @IsEnum(ReactionType)
  type: ReactionType;
}