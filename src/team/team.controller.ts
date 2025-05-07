import { 
  Body, 
  Controller, 
  Post, 
  Delete, 
  Patch, 
  UseGuards, 
  Request, 
  Param, 
  Get
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Request() req, @Body() data: CreateTeamDto) {
      return this.teamService.create(req.user.sub, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':teamId/add-member')
  async addMember(
      @Param('teamId') teamId: string,
      @Body() { userId, role }: { userId: string; role?: string }
  ) {
      return this.teamService.addTeamMember(teamId, userId, role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':teamId/remove-member/:userId')
  async removeMember(
      @Param('teamId') teamId: string,
      @Param('userId') userId: string
  ) {
      return this.teamService.removeTeamMember(teamId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':teamId/update')
  async updateTeam(
      @Param('teamId') teamId: string,
      @Body() data: Partial<CreateTeamDto>
  ) {
      return this.teamService.updateTeam(teamId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':teamId/delete')
  async deleteTeam(@Param('teamId') teamId: string) {
      return this.teamService.deleteTeam(teamId);

  }

  
  @UseGuards(JwtAuthGuard)
  @Get(':teamId/members')
  async getAllTeamMembers(@Param('teamId') teamId: string) {
      return this.teamService.getAllTeamMembers(teamId);
  }

  // ✅ Get all teams for a specific user
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getTeamsForUser(@Param('userId') userId: string) {
      return this.teamService.getTeamsForUser(userId);
  }

  // ✅ Get a specific team by ID
  @UseGuards(JwtAuthGuard)
  @Get(':teamId')
  async getTeamById(@Param('teamId') teamId: string) {
      return this.teamService.getTeamById(teamId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('active/:teamId')
  async getTeamActive(@Param('teamId') teamId: string) {
      return this.teamService.getActiveTeamMembers(teamId);
  }


  @Get(':teamId/member/:memberId')
    async getTeamMember(
        @Param('teamId') teamId: string,
        @Param('memberId') memberId: string
    ) {
        return this.teamService.getTeamMemberById(teamId, memberId);
    }
}