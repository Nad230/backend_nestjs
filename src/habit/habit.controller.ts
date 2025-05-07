import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from "@nestjs/common"
import  { HabitService } from "./habit.service"
import  { HabitDto } from "./dto/habit.dto"
import { AuthGuard } from "@nestjs/passport"
import  { HabitStatus } from "@prisma/client"

@Controller("habits")
@UseGuards(AuthGuard("jwt"))
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  async create(@Req() req:  Request & { user: { id_users: string } }, @Body() data: HabitDto): Promise<any> {
    const userId = req.user.id_users
    return this.habitService.create(userId, data)
  }

  @Get()
  findAll(@Req() req: Request & { user: { id_users: string } }) {
    const userId = req.user.id_users;
    return this.habitService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habitService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() habitDto: HabitDto) {
    return this.habitService.update(id, habitDto)
  }

  @Patch(":id/status")
  updateStatus(@Param('id') id: string, @Body('status') status: HabitStatus) {
    return this.habitService.updateStatus(id, status)
  }

  @Post(":id/completion")
  recordCompletion(@Param('id') id: string, @Body('completed') completed: boolean, @Body('notes') notes?: string) {
    return this.habitService.recordCompletion(id, completed, notes)
  }

  @Post(":id/reset")
  resetHabit(@Param('id') id: string) {
    return this.habitService.resetHabit(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitService.remove(id);
  }
}
