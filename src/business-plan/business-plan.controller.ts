import { Controller, UseGuards ,Post,Body,Request,Get, Param, Patch, InternalServerErrorException} from '@nestjs/common';
import { BusinessPlanService } from './business-plan.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateBusinessPlanDto } from './dto/create-business-plan.dto';
import { CreatebusinessplanDto } from './dto/createplanBusiness.dto';

@Controller('business-plan')
export class BusinessPlanController {

  constructor(private readonly businessPlanService: BusinessPlanService) {}
  @UseGuards(JwtAuthGuard)

  @Post('userplan')
  async createuserplan(@Body() body: CreatebusinessplanDto,    @Request() req,
) {
      const createdPlan = await this.businessPlanService.createLocalUserBusinessplan(body,req.user.sub);
      return createdPlan;
   
  }


    @UseGuards(JwtAuthGuard)
    @Post()
    create(
    @Body() dto: CreateBusinessPlanDto,
    @Request() req,
    ) {
    // Prefer taking userId from the JWT:
    return this.businessPlanService.create(dto,req.user.sub);
    }
   


    @Get('startup/:startupPlanId/tasks')
    async getTasksByStartupId(@Param('startupPlanId') startupPlanId: string) {
      return this.businessPlanService.getAiPlanTasksByStartupPlanId(startupPlanId);
    }
    
    @Get('startup/:startupPlanId/todaytask')
    async getFirstIncompleteTaskStartupId(@Param('startupPlanId') startupPlanId: string) {
      return this.businessPlanService.getFirstIncompleteAiPlanTask(startupPlanId);
    }
    @Patch('startup/updateTask/:id')
    async updateTaskstatus(
      @Param('id') taskId: string,
      @Body() body: { completed: boolean },
    ) {
      return this.businessPlanService.updateAiPlanTaskCompleted(taskId, body.completed);
    }
    

    @Get('startup/:startupPlanId/budget')
    async getBudgetItemByStartupId(@Param('startupPlanId') startupPlanId: string) {
      return this.businessPlanService.getBudgetItemsByStartupPlanId(startupPlanId);
    }

    @Get('startup/:startupPlanId/expenses')
    async getBudgetRangeStartupId(@Param('startupPlanId') startupPlanId: string) {
      return this.businessPlanService.getUserExpensesByStartupPlanId(startupPlanId);
    }
    @Get('startup/:startupPlanId/progress')
    async getprogressStartupId(@Param('startupPlanId') startupPlanId: string) {
      return this.businessPlanService.getAiPlanProgress(startupPlanId);
    }

    @Get('startup/:startupPlanId/calendar')
    async getCalanderByStartupId(@Param('startupPlanId') startupPlanId: string) {
      return this.businessPlanService.getCalendarWeeksByStartupPlanId(startupPlanId);
    }
    @Get('startup/:startupPlanId/risks')
    async getRisksByStartupId(@Param('startupPlanId') startupPlanId: string) {
      try {
        return await this.businessPlanService.getRisksByStartupPlanId(startupPlanId);
      } catch (error) {
        console.error('Error fetching risks:', error);
        throw new InternalServerErrorException('Failed to load risks');
      }
    }
    
    @Get('startup/:startupPlanId/tips')
    async getRipsByStartupId(@Param('startupPlanId') startupPlanId: string) {
      return this.businessPlanService.getTipsByStartupPlanId(startupPlanId);
    }

    
  
    @UseGuards(JwtAuthGuard)
    @Get("plans")
    getstartupplanByuserId(
    @Request() req,
    ) {
    // Prefer taking userId from the JWT:
    return this.businessPlanService.getPlansByUser(req.user.sub);
    }
   

    @UseGuards(JwtAuthGuard)
    @Get("startupPlan")
    getplanByuserId(
    @Request() req,
    ) {
    // Prefer taking userId from the JWT:
    return this.businessPlanService.getStartupPlansByUserId(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get("TaskstartupPlan")
    getTaskplanByuserId(
    @Request() req,
    ) {
    // Prefer taking userId from the JWT:
    return this.businessPlanService.getTaskStartupPlansByUserId(req.user.sub);
    }
    


    @UseGuards(JwtAuthGuard)
    @Get()
    getByuserId(
    @Request() req,
    ) {
    // Prefer taking userId from the JWT:
    return this.businessPlanService.getByUserId(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/:id")
    getBybuisnessId(
      @Param("id")id:string,
    @Request() req,
    ) {
    // Prefer taking userId from the JWT:
    return this.businessPlanService.getByBusinessId(id);
    }






}
