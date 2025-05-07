import { Body, Controller,Patch, Post, UseGuards, Request, Get, BadRequestException, InternalServerErrorException, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';  // Import SupabaseService
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
    supabase: any;
  constructor(
    private readonly authService: AuthService,
    private readonly supabaseService: SupabaseService  // Inject SupabaseService here
  ) {}



  @Get('wasActive')
  @UseGuards(JwtAuthGuard)
  getActive(@Request() req) {
    return this.authService.wasUserActiveToday(req.user.sub); // The logged-in user's data
  }

  @Get('lastTimeActive')
  @UseGuards(JwtAuthGuard)
  getlastTimeActive(@Request() req) {
    return this.authService.getTimeSinceLastLogin(req.user.sub); // The logged-in user's data
  }

  @Get('stats')
  async getstats() {
    return this.authService.getUserStats();
  }

  @Get('statsPackage')
  async getstatsPackage() {
    return this.authService.getUsersByPackageType();
  }
  @Get('search')
  async searchByName(@Query('name') name: string) {
    return this.authService.getProfileByName(name);
  }
  @Post('register')
  async register(@Body() body: { email: string; password: string; fullname: string }) {
    return this.authService.register(body);
  }
  

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
  

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user; // The logged-in user's data
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return this.authService.getprofile(userId);
  }
 
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Request() req: Request & { user: { id: string } }) {
    const currentUserId = req.user.id; 
    return this.authService.getUsers(currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(@Request() req) {
    return this.authService.getAllUsers(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('typeproject')
  async getProjctType(@Request() req) {
    return this.authService.getTypeBusinessByUser(req.user.sub);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() body: UpdateProfileDto) {
   return this.authService.updateProfile(req.user.sub, body);
   }

   @Patch('password')
   @UseGuards(JwtAuthGuard)
   async updatePassword(@Request() req, @Body() body: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user.sub, body);
   }

   
}
