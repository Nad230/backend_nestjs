import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ProjectModule } from './project/project.module';
import { TimeEntryModule } from './time-entry/time-entry.module';
import { AiController } from './ai/ai.controller';
import { AIModule } from './ai/ai.module';
import { TeamModule } from './team/team.module';
import { TranslateModule } from './translation/translation.module';
import { MilestoneModule } from './milestone/milestone.module';
import { TaskModule } from './task/task.module';
import { AchivementModule } from './achivement/achivement.module';
import { CreatorModule } from './creator/creator.module';

import { ScheduleModule } from '@nestjs/schedule';
import { GoalCreatorService } from './goal-creator/goal-creator.service';
import { GoalCreatorModule } from './goal-creator/goal-creator.module';
import { CreatorAiModule } from './creator-ai/creator-ai.module';
import { InferenceModule } from './inference/inference.module';
import { AcademicModule } from './academic/academic.module';
import { FilesModule } from './files/files.module';
import { CitationModule } from './citation/citation.module';
import { PresentationModule } from './presentation/presentation.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';
/*import { ExpenseModule } from './expense/expense.module';*/
import { TransactionsModule } from './transactions/transactions.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ProjectOfflineAiModule } from './project-offline-ai/project-offline-ai.module';
import { UserlocationModule } from './userlocation/userlocation.module';
import { BusinessPlanModule } from './business-plan/business-plan.module';
import { ClientModule } from './client/client.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ProfitModule } from './profit/profit.module';



import { HabitModule } from './habit/habit.module';
import { PostModule } from './post/post.module';
import { ReactionModule } from './reaction/reaction.module';
import { CommentModule } from './comment/comment.module';
import { MessageModule } from './msg/msg.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, PrismaModule, SupabaseModule, ProjectModule, AIModule, TeamModule, TranslateModule, MilestoneModule, TaskModule, AchivementModule, TimeEntryModule, CreatorModule,  ScheduleModule.forRoot(), GoalCreatorModule, CreatorAiModule, InferenceModule, AcademicModule, FilesModule, CitationModule, PresentationModule, ProductModule, SaleModule, TransactionsModule, ExpensesModule, ProjectOfflineAiModule, UserlocationModule, BusinessPlanModule, ClientModule, InvoiceModule, ProfitModule , HabitModule,
    PostModule,
    ReactionModule,
    CommentModule,
    MessageModule,
    ChatModule,/*ExpenseModule*//*SocialMediaCronModule*/],
  controllers: [AiController],
  providers: [GoalCreatorService],
})
export class AppModule {}
