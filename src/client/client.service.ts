import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-clientdialog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {

  constructor(private prisma: PrismaService) {}




     async  createClient(data: CreateClientDto,userId:string) {
        try {
          const client = await this.prisma.client.create({
            data: {
              name: data.name,
              photo: data.photo,
              ...(data.userId && {
                user: { connect: { id: data.userId } }
              }),
      
              creator: {
                connect: {
                  id: userId,
                },
              },
            },
          });
            
      
          return client
        } catch (error) {
          console.error("Failed to create client:", error)
          throw new Error("Could not create client")
        }
      }

      async getClientsForUser(userId: string) {
        return this.prisma.client.findMany({
          where: {
            OR: [
              { userId: userId },
              { createdBy: userId }
            ]
          },
          include: {
            projects: true,
            Invoice: {
              include: {
                items: true, // This line includes the related items for each invoice
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      }
      



      async updateClient(dto: UpdateClientDto, userId: string) {
        const { id, name, photo, userId: linkUserId } = dto;
        const data: any = {};
    
        if (name  !== undefined) data.name  = name;
        if (photo !== undefined) data.photo = photo;
    
        if (linkUserId !== undefined) {
          data.user = { connect: { id: linkUserId } };
        }
    
        // Only update if the client was created by this user
        const result = await this.prisma.client.updateMany({
          where: { id, createdBy: userId },
          data,
        });
    
        if (result.count === 0) {
          throw new NotFoundException(
            'Client not found or you do not have permission to update it'
          );
        }
    
        // Return the updated client
        return this.prisma.client.findUnique({
          where: { id },
        });
      }
    
}
