import { Body, Controller, Post, UseGuards,Request, Get, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserlocationService } from './userlocation.service';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { BudgetRange } from '@prisma/client';
@UseGuards(JwtAuthGuard)
@Controller('userlocation')
export class UserlocationController {
    constructor(private readonly userlocationService: UserlocationService) {}
    @Post()
    create(@Body() createSaleDto:CreateUserLocationDto, @Request() req) {
      const userId = req.user.sub;
      return this.userlocationService.createUserLocation(createSaleDto, userId);
    }

    @Get('location')
  async getByUserId(@Request() req) {
    const userId = req.user.sub;

    return this.userlocationService.getUserLocationByUserId(userId);
  }
  @Get('location/nearby')
  getNearby(@Request() req) {
    const userId = req.user.sub;

    return this.userlocationService.getNearbyPlaces(userId);
  }
 
  @Get('place')
  getNearPlaces(@Request() req) {
    const userId = req.user.sub;

    return this.userlocationService.getPlaces(userId);
  }


  @Patch(':id/updateBudgetRange')
  updateBudgetRange(
    @Param('id') id: string,
    @Body('budgetRange') budgetRange: number,
    @Request() req
  ) {
    const userId = req.user.sub;
    return this.userlocationService.updateLocationBudget(id, budgetRange);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { range: number }, // or use a DTO
    @Request() req
  ) {
    const userId = req.user.sub;
    return this.userlocationService.updateUserLocation(id, body.range);
  }
  
    
    
}
