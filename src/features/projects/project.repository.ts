import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Import du service Prisma
import { Project, Prisma } from '@prisma/client';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({ data });
  }

  async getProjectsByMember(userId: string) {
    const query: Prisma.ProjectFindManyArgs = {
      where: {
        members: {
          some: {
            userId: userId, // <== filtre sur l'appartenance
          },
        },
      },
      include: {
        members: {
          include: {
            user: true, // si tu veux les infos de l’utilisateur dans le membre
          },
        },
        calls: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        chapters: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    };
    return this.prisma.project.findMany(query);
  }

  getProjectById = async (id: string): Promise<Project | null> => {
    return this.prisma.project.findUnique({
      where: { id },
    });
  };

  updateProject = async (
    id: string,
    data: Prisma.ProjectUpdateInput,
  ): Promise<Project> => {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  };

  deleteProject = async (id: string): Promise<Project> => {
    return this.prisma.project.delete({
      where: { id },
    });
  };
}
