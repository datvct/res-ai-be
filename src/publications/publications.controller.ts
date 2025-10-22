import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('publications')
@Controller('publications')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new publication (Admin only)' })
  @ApiResponse({ status: 201, description: 'Publication created successfully' })
  async create(@Body() createPublicationDto: CreatePublicationDto) {
    const publication = await this.publicationsService.create(createPublicationDto);
    return { message: 'Publication created successfully', data: publication };
  }

  @Get()
  @ApiOperation({ summary: 'Get all publications' })
  @ApiResponse({ status: 200, description: 'Return all publications' })
  async findAll(@Query('lecturerId') lecturerId?: string) {
    if (lecturerId) {
      return await this.publicationsService.findByLecturer(lecturerId);
    }
    return await this.publicationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get publication by ID' })
  @ApiResponse({ status: 200, description: 'Return publication by ID' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async findOne(@Param('id') id: string) {
    return await this.publicationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update publication by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Publication updated successfully' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async update(@Param('id') id: string, @Body() updatePublicationDto: UpdatePublicationDto) {
    const publication = await this.publicationsService.update(id, updatePublicationDto);
    return { message: 'Publication updated successfully', data: publication };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete publication by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Publication deleted successfully' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async remove(@Param('id') id: string) {
    await this.publicationsService.remove(id);
    return { message: 'Publication deleted successfully' };
  }
}
