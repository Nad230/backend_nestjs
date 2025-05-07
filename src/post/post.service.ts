import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { MediaType, Privacy } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // Créer un post avec des médias
  async create(authorId: string, createPostDTO: CreatePostDTO, files?: Express.Multer.File[]) {
    if (!authorId) {
      throw new Error("User ID is missing in request.");
    }
  
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id_users: authorId },
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${authorId} not found.`);
    }
  
    // Créer le post
    const post = await this.prisma.post.create({
      data: {
        content: createPostDTO.content,
        privacy: createPostDTO.privacy || Privacy.Public,
        user: { connect: { id_users: authorId } }, // Lier l'utilisateur au post
      },
    });
  
    // Traiter les fichiers uploadés
    if (files && files.length > 0) {
      for (const file of files) {
        let mediaType: MediaType;
        if (file.mimetype.startsWith('image/')) {
          mediaType = MediaType.Image;
        } else if (file.mimetype.startsWith('video/')) {
          mediaType = MediaType.Video;
        } else if (file.mimetype.startsWith('audio/')) {
          mediaType = MediaType.Audio;
        } else {
          continue; // Ignorer les types de fichiers non supportés
        }
  
        // Ensure the URL is correctly generated
        const filename = file.filename || file.originalname; // Fallback to originalname if filename is undefined
        const url = `/uploads/${filename}`; // Construct the URL
  
        // Enregistrer le média dans la base de données
        await this.prisma.postMedia.create({
          data: {
            postId: post.id,
            type: mediaType,
            url, // Use the corrected URL
            fileName: file.originalname,
            fileSize: file.size,
          },
        });
      }
    }
  
    // Retourner le post avec les médias
    return this.prisma.post.findUnique({
      where: { id: post.id },
      include: { media: true, user: true },
    });
  }
  async findAll() {
    const posts = await this.prisma.post.findMany({
      include: {
        user: true, // Inclure les informations de l'utilisateur dans la réponse
        reactions: true, // Inclure les réactions
        comments: true, // Inclure les commentaires
        media: true, // Inclure les médias
      },
    });
  
    // Ajouter le nombre de réactions à chaque post
    return posts.map(post => ({
      ...post,
      reactionCount: post.reactions.length, // Calcul du nombre de réactions pour chaque post
    }));
  }
  

  async findByUser(authorId: string) {
    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        user: true, // Inclure les informations de l'utilisateur dans la réponse
        reactions: true,
        comments: true,
        media: true,
      },
    });
  }

 
async update(id: string, updatePostDTO: UpdatePostDTO, files?: Express.Multer.File[]) {
  console.log("Received update data in service:", updatePostDTO); // Debugging

  const existingPost = await this.prisma.post.findUnique({
    where: { id },
  });

  if (!existingPost) {
    throw new NotFoundException(`Post with ID ${id} not found.`);
  }

  // Use optional chaining to safely access properties of updatePostDTO
  const updatedData: any = {
    content: updatePostDTO?.content ?? existingPost.content,
    privacy: updatePostDTO?.privacy ?? existingPost.privacy,
    updatedAt: new Date(),
    isEdited: true,
  };

  // Handle file uploads (if any)
  if (files && files.length > 0) {
    for (const file of files) {
      let mediaType: MediaType;
      if (file.mimetype.startsWith('image/')) {
        mediaType = MediaType.Image;
      } else if (file.mimetype.startsWith('video/')) {
        mediaType = MediaType.Video;
      } else if (file.mimetype.startsWith('audio/')) {
        mediaType = MediaType.Audio;
      } else {
        continue; // Skip unsupported file types
      }

      const filename = file.filename || file.originalname;
      const url = `/uploads/${filename}`;

      await this.prisma.postMedia.create({
        data: {
          postId: existingPost.id,
          type: mediaType,
          url,
          fileName: file.originalname,
          fileSize: file.size,
        },
      });
    }
  }

  return this.prisma.post.update({
    where: { id },
    data: updatedData,
  });
}
async delete(id: string) {
  // Step 1: Check if the post exists
  const existingPost = await this.prisma.post.findUnique({
    where: { id },
    include: { media: true }, // Include related media
  });

  if (!existingPost) {
    throw new NotFoundException(`Post with ID ${id} not found.`);
  }

  // Step 2: Delete related media (if any)
  if (existingPost.media && existingPost.media.length > 0) {
    await this.prisma.postMedia.deleteMany({
      where: { postId: id },
    });
  }

  // Step 3: Delete related reactions (if any)
  await this.prisma.postReaction.deleteMany({
    where: { postId: id },
  });

  // Step 4: Delete related comments (if any)
  await this.prisma.postComment.deleteMany({
    where: { postId: id },
  });

  // Step 5: Delete related notifications (if any)


  // Step 6: Finally, delete the post
  return this.prisma.post.delete({
    where: { id },
  });
}

  async incrementShareCount(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        shareCount: { increment: 1 },
      },
    });
  }
}