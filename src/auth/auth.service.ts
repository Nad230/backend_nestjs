import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Role } from '@prisma/client';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { EmailService } from './auth.sendemail';
import { startOfToday, endOfToday } from 'date-fns';
import { startOfMonth, endOfMonth } from 'date-fns';
import { startOfWeek, endOfWeek } from 'date-fns';

import { differenceInMinutes, differenceInHours, differenceInDays, formatDistanceToNow, isToday } from 'date-fns';




@Injectable()
export class AuthService {
  constructor(
    private emailService:EmailService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}


  
  async getTimeSinceLastLogin(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lastLogin: true },
    });
  
    if (!user || !user.lastLogin) {
      return 'Never logged in';
    }
  
    return formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true });
  }
  async wasUserActiveToday(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lastLogin: true },
    });
  
    if (!user || !user.lastLogin) return false;
  
    return isToday(new Date(user.lastLogin));
  }
  
 /* async getUserById(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          projects: {
            include: {
              tasks: true,
            },
          },
          posts: {
            include: {
              media: true,
              reactions: true,
              comments: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          habits: {
            include: {
              completions: {
                orderBy: {
                  date: "desc",
                },
                take: 10,
              },
            },
          },
          followedBy: {
            include: {
              follower: {
                select: {
                  id: true,
                  fullname: true,
                  profile_photo: true,
                },
              },
            },
          },
          following: {
            include: {
              following: {
                select: {
                  id: true,
                  fullname: true,
                  profile_photo: true,
                },
              },
            },
          },
        },
      })

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`)
      }

      return user
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error("Error fetching user by ID:", error)
      throw new InternalServerErrorException("Failed to fetch user profile")
    }
  }
*/
  async getUsersActiveToday(): Promise<number> {
    const count = await this.prisma.user.count({
      where: {
        lastLogin: {
          gte: startOfToday(),
          lte: endOfToday(),
        },
      },
    });
  
    return count;
  }

  async getUsersActiveThisMonth(): Promise<number> {
    const count = await this.prisma.user.count({
      where: {
        lastLogin: {
          gte: startOfMonth(new Date()),
          lte: endOfMonth(new Date()),
        },
      },
    });
  
    return count;
  }
  async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async getNewUsersThisWeek(): Promise<number> {
    return this.prisma.user.count({
      where: {
        created_at: {
          gte: startOfWeek(new Date(), { weekStartsOn: 1 }), 
          lte: endOfWeek(new Date(), { weekStartsOn: 1 }),
        },
      },
    });
  }
  async getUserStats() {
    const [totalUsers, newUsersThisWeek, activeToday, activeThisMonth] = await Promise.all([
      this.getTotalUsers(),
      this.getNewUsersThisWeek(),
      this.getUsersActiveToday(),
      this.getUsersActiveThisMonth(),
    ]);
  
    return {
      totalUsers,
      newUsersThisWeek,
      activeToday,
      activeThisMonth,
    };
  }


  async getUsersByPackageType() {
    const [silver, gold, diamond] = await Promise.all([
      this.prisma.user.count({ where: { packageType: 'SILVER' } }),
      this.prisma.user.count({ where: { packageType: 'GOLD' } }),
      this.prisma.user.count({ where: { packageType: 'DIAMOND' } }),
    ]);
  
    return {
      SILVER: silver,
      GOLD: gold,
      DIAMOND: diamond,
    };
  }
  
  
  async register(data: { email: string; password: string; fullname: string; role?: any }) {
    const supabase = this.supabaseService.getClient();
  
    try {
      // Step 1: Register in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: false,
      });
  
      if (authError) {
        // If email is already registered
        if (authError.message.includes('User already registered')) {
          throw new ConflictException('Email already exists in Supabase Auth');
        }
        throw new ConflictException(`Supabase Auth Error: ${authError.message}`);
      }
  
      const userId = authData.user?.id;
      if (!userId) {
        throw new InternalServerErrorException('Failed to retrieve user ID from Supabase.');
      }
  
      // Step 2: Store additional details in your database
      const hashedPassword = await bcrypt.hash(data.password, 10);
  
      const user = await this.prisma.user.create({
        data: {
          id_users: userId,
          email: data.email,
          password: hashedPassword,
          fullname: data.fullname,
          role: data.role || Role.USER,
          emailVerified: true,
        },
      });
  
      // Optionally: Send confirmation email or welcome email here
  
      return user;
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }
  
 
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
  
    if (!user) {
      throw new ConflictException('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid email or password');
    }
  
    // ✅ Update lastLogin field here
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
  
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
  


  async getprofile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, // Ensure this matches your DB field
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        location:true,
        startHour:true,
        endHour:true,
        BudgetRange:true,
        profile_photo:true,
        projectType:true,
        packageType:true,
        lastLogin :true,
        firstTime:true
      },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }

  async getProfileByName(name: string) {
    const user = await this.prisma.user.findUnique({
      where: { fullname: name }, // fullname must be unique in your schema
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        location: true,
        startHour: true,
        endHour: true,
        BudgetRange: true,
        profile_photo: true,
        projectType: true,
        packageType: true,
        firstTime: true
      },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }
  


  async getBudgetUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, // Ensure this matches your DB field
      select: {
      
        BudgetRange:true
      },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }


  
  async getTypeBusinessByUser(userId: string) {
    const user = await this.prisma.user.findMany({
      where: { id: userId }, // Ensure this matches your DB field
      select: {
        projectType:true
      },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }
  async updateProfile(userId: string, data: UpdateProfileDto) {
    // Check if the user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // If email is being updated, check for duplicates
    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
  
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }
  
    // Update the user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullname: data.fullname || user.fullname,
        email: data.email || user.email,
        role:data.role || user.role,
        projectName:data.projectName || user.projectName,
        projectType: data.projectType || user.projectType,
        language:data.language||user.language,
        location:data.location||user.location,
        startHour:data.startHour||user.startHour,
        endHour:data.endHour||user.endHour,
        BudgetRange:data.BudgetRange|| user.BudgetRange,
        profile_photo: data.profile_photo || user.profile_photo,
        packageType:data.packageType  || user.packageType,
        firstTime: typeof data.firstTime === 'boolean' 
        ? data.firstTime 
        : user.firstTime
      
      },
    });
  
    return updatedUser;
  }


  async updatePassword(userId: string, data: UpdatePasswordDto) {
    // Step 1: Find the user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    // Step 2: Compare the current password
    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect current password');
    }
  
    // Step 3: Hash the new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  
    // Step 4: Update the password in the database
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password');
    }
  }
  async getUsers(currentUserId?: string) {
    const whereCondition = currentUserId
      ? { id_users: { not: currentUserId } }
      : {};
  
    const users = await this.prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        id_users: true,
        fullname: true,
        profile_photo: true,
        email: true,
        phone: true
      }
    });
  
    return users;
  }
  
  async getAllUsers(currentUserId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
  
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        packageType: true,
        created_at: true,
        lastLogin: true, // Required to determine status
        profile_photo: true,
      },
    });
  
    // Add active status (based on last login)
    return users.map(user => {
      const isActiveToday =
        user.lastLogin && user.lastLogin >= today;
  
      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        packageType: user.packageType,
        joined: user.created_at,
        status: isActiveToday ? 'Active' : 'Inactive',
        profile_photo: user.profile_photo,
      };
    });
  }
  
 
}
