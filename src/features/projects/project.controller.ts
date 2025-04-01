import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectRepository: ProjectRepository) {}

  @Post()
  async create(@Body() data: Prisma.ProjectCreateInput) {
    return this.projectRepository.createProject(data);
  }

  @Get()
  async findAll() {
    return this.projectRepository.getProjects();
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
