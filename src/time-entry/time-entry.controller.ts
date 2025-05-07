import { Controller, Post, Body, Request, UseGuards, Param, Patch, Get, Req } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('time-entry')
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Request() req, @Body() data: CreateTimeEntryDto) {
    return this.timeEntryService.create(req.user.sub, data);
  }

  @Patch(':id/stop')
  async stopTimer(@Request() req, @Param('id') timeEntryId: string) {
    return this.timeEntryService.stopTimer(timeEntryId);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
async getAll(@Req() req) {
  const userId = req.user.id; // Ensure authentication middleware sets this
  return this.timeEntryService.getAll(userId);
}

  
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getTimeStats(@Request() req) {
    return this.timeEntryService.getTimeStats(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('todayTotal')
  findtoday(@Request() req) {
    const userId = req.user.sub;
    return this.timeEntryService.getTodayTotalDuration(userId);
  
  }
  @UseGuards(JwtAuthGuard)

  @Patch(':id/add-note')
async appendNote(
  @Param('id') id: string,
  @Body('note') newNote: string,
  @Request() req
) {
  const userId = req.user?.id // Assuming auth is handled with a decorator/middleware
  return this.timeEntryService.appendNote(id, newNote, userId)
}

}