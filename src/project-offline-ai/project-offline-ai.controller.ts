import { Controller, Get, Query, UseGuards ,Request, Body, BadRequestException, Put, Param, Post} from '@nestjs/common';
import { ProjectOfflineAiService } from './project-offline-ai.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';

@Controller('project-offline-ai')
export class ProjectOfflineAiController {
    constructor(private readonly aiService: ProjectOfflineAiService) {}
    @UseGuards(JwtAuthGuard)

    @Get()
    async getAdvice(
      @Request() req,
      @Query('project') projectName: string,
      @Query('type') type: string,
      @Query('location') location: string,
      @Query('startHour') startHour: number,
      @Query('endHour') endHour: number,

    ) {
      const advice = await this.aiService.getAiAdvice(projectName, location, type,req.user.sub,startHour,endHour);
      return advice;
    }



    @Get('job-search/linkedin')
    async getLinkedInJobSearch(
      @Request() req,
      @Query('skills') skills: string,
      @Query('city') city: string,
      @Query('country') country: string,
      @Query('experienceLevel') experienceLevel: string,
    ) {
      const parsedSkills = skills.split(',').map(skill => skill.trim());
      
      const result = await this.aiService.getLinkedInSearchQuery(
        parsedSkills,
        city,
        country,
        experienceLevel
      );
    
      return result;
    }



    @Get('job-search/real')
async getRealJobs(
  @Query('skills') skills: string,
  @Query('city') city: string,
  @Query('country') country: string,
  @Query('experienceLevel') experienceLevel: string
) {
  const query = `${skills} ${experienceLevel} developer`;
  const location = `${city}, ${country}`;

  const jobs = await this.aiService.getJobListingsFromSerpApi(query, location,experienceLevel);

  return jobs.length ? jobs : { message: 'No jobs found matching your criteria.' };
}


@UseGuards(JwtAuthGuard)

@Get('job-search/reallife')
async getJobs(
  @Request() req,
  @Query('skills') skills: string,
  @Query('continent') continent: string,
  @Query('country') country: string,

) {


  const jobs = await this.aiService.getJobsBySkill(skills,country,continent,req.user.sub);

  return jobs.length ? jobs : { message: 'No jobs found matching your criteria.' };
}

@Get('job-search/reallifeRemote')
async getJobsWithRemote(
  @Body('skills') skills: string,
  @Body('continent') continent: string,
  @Body('country') country: string,

) {


  const jobs = await this.aiService.getRemoteOkJobs(skills,country,continent);

  return jobs.length ? jobs : { message: 'No jobs found matching your criteria.' };
}


@Put('updataijobs/:aiJobId')
async updateaijob(
  @Param('aiJobId') aiJobId: string,
  @Body('status') status: string,
  @Body('chosed') chosed:boolean,

) {


  const jobs = await this.aiService.updateAiJobStatusAndChosed(aiJobId,status,chosed);

  return jobs
}



@Post('InterviewQuations')
async aiquations(
  @Body('description') description: string,
  @Body('tags') tags: string[],
) {
  const jobs = await this.aiService.generateInterviewQuestions(description, tags);
  return jobs;
}

@UseGuards(JwtAuthGuard)

@Get('aijobs')
async getaijobs(
  @Request() req,

) {


  const jobs = await this.aiService.getAiJobsByUser(req.user.sub);
  return jobs.length ? jobs : { message: 'No jobs found matching your criteria.' };

}


@Get('aijobs/:id')
async getaijobsByid(
  @Param("id") id:string,

) {


  const jobs = await this.aiService.getAiJobById(id);
  return jobs

}
@UseGuards(JwtAuthGuard)

@Get('aijobsChosed')
async getaijobsChosed(
  @Request() req,

) {


  const jobs = await this.aiService.getChosedAiJobsByUser(req.user.sub);
  return jobs.length ? jobs : { message: 'No jobs found matching your criteria.' };

}

    
    @UseGuards(JwtAuthGuard)

    @Get('country')
    async getcountry(
      @Request() req,
      @Body('country') country: string

    ) {
      const advice = await this.aiService.getCountryInsights(country);
      return advice;
    }


    /*@UseGuards(JwtAuthGuard)
    @Get('place')
    async getNearbyPlaces(
      @Request() req,
      @Query('lat') lat: string,
      @Query('lng') lng: string,
    ) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
    
      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        throw new BadRequestException('Invalid latitude or longitude');
      }
    
      return await this.aiService.getNearbyPlaces({ lat: parsedLat, lng: parsedLng });
    }
    
*/
    @Get('city')
    async getcity(
      @Request() req,
      @Body('country') country: string,
      @Body('city') city: string


    ) {
      const advice = await this.aiService.getCityBusinessInsights(city,country);
      return advice;
    }
    @UseGuards(JwtAuthGuard)

    @Get('workadvice')
    async getworkadvice(
      @Request() req,

      @Query('count') count: number,



    ) {
      const advice = await this.aiService.getSmartBusinessSuggestion(req.user.sub,count);
      return advice;
    }




    @UseGuards(JwtAuthGuard)

    @Get('planadvice')
    async generateBusinessplan(
      @Request() req,



    ) {
      const advice = await this.aiService.generateLocalBusinessActionPlan(req.user.sub);
      return advice;
    }





    



@UseGuards(JwtAuthGuard)
@Post('plandvice')
async getplanadvice(
  @Request() req,
  @Query('BudgetRange', ParseIntPipe) BudgetRange: number,
  @Query('BusinessesId') BusinessesId: string

) {
  const advice = await this.aiService.generateBusinessActionPlan(req.user.sub, BudgetRange,BusinessesId);
  return advice;
}




  }

