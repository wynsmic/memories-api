import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AuthService } from '../../auth/auth.service';
import { AuthenticatedRequest } from '../../auth/types/authenticated-request';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body()
    data: {
      title: string;
      interviewee: {
        firstname: string;
        lastname: string;
        phone: string;
      };
    },
  ) {
    const authProviderId = req.user.userId;
    const user = await this.authService.findUser(authProviderId);
    if (!user) {
      throw new NotFoundException(`User with sub ${authProviderId} not found`);
    }
    /*
    let interviewee = await this.userService.findUserByPhone(
      data.interviewee.phone,
    );
    if (!interviewee) {
      interviewee = await this.userService.createUser(data.interviewee);
    }*/
    const project: Prisma.ProjectCreateInput = {
      title: data.title,
      members: {
        create: [
          {
            user: { connect: { id: user.id } }, // << connect the logged-in user
            role: 'OWNER',
            invitationStatus: 'ACCEPTED',
          },
          {
            user: {
              connectOrCreate: {
                where: { phone: data.interviewee.phone },
                create: {
                  firstname: data.interviewee.firstname,
                  lastname: data.interviewee.lastname,
                  phone: data.interviewee.phone,
                },
              },
            },
            role: 'INTERVIEWEE',
            invitationStatus: 'NOT_REQUESTED',
          },
        ],
      },
    };
    return this.projectRepository.createProject(project);
  }

  @Get()
  async findAllByMember(userId: string) {
    const projects = await this.projectRepository.getProjectsByMember(userId);
    return projects;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.projectRepository.getProjectById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.ProjectUpdateInput,
  ) {
    return this.projectRepository.updateProject(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectRepository.deleteProject(id);
  }
}
