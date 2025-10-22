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
import { LecturersService } from './lecturers.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { SearchLecturerDto } from './dto/search-lecturer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('lecturers')
@Controller('lecturers')
@UseInterceptors(ClassSerializerInterceptor)
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new lecturer (Admin only)' })
  @ApiResponse({ status: 201, description: 'Lecturer created successfully' })
  async create(@Body() createLecturerDto: CreateLecturerDto) {
    const lecturer = await this.lecturersService.create(createLecturerDto);
    return { message: 'Lecturer created successfully', data: lecturer };
  }

  @Get()
  @ApiOperation({ summary: 'Get all lecturers' })
  @ApiResponse({ status: 200, description: 'Return all lecturers' })
  async findAll() {
    return await this.lecturersService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search lecturers by criteria' })
  @ApiResponse({ status: 200, description: 'Return matching lecturers' })
  async search(@Query() searchDto: SearchLecturerDto) {
    return await this.lecturersService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lecturer by ID' })
  @ApiResponse({ status: 200, description: 'Return lecturer by ID' })
  @ApiResponse({ status: 404, description: 'Lecturer not found' })
  async findOne(@Param('id') id: string) {
    return await this.lecturersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update lecturer by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lecturer updated successfully' })
  @ApiResponse({ status: 404, description: 'Lecturer not found' })
  async update(@Param('id') id: string, @Body() updateLecturerDto: UpdateLecturerDto) {
    const lecturer = await this.lecturersService.update(id, updateLecturerDto);
    return { message: 'Lecturer updated successfully', data: lecturer };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete lecturer by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lecturer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lecturer not found' })
  async remove(@Param('id') id: string) {
    await this.lecturersService.remove(id);
    return { message: 'Lecturer deleted successfully' };
  }

  @Post(':id/keywords')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add keywords to lecturer (Admin only)' })
  @ApiResponse({ status: 200, description: 'Keywords added successfully' })
  async addKeywords(@Param('id') id: string, @Body('keywordIds') keywordIds: string[]) {
    const lecturer = await this.lecturersService.addKeywords(id, keywordIds);
    return { message: 'Keywords added successfully', data: lecturer };
  }

  @Delete(':id/keywords')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove keywords from lecturer (Admin only)' })
  @ApiResponse({ status: 200, description: 'Keywords removed successfully' })
  async removeKeywords(@Param('id') id: string, @Body('keywordIds') keywordIds: string[]) {
    const lecturer = await this.lecturersService.removeKeywords(id, keywordIds);
    return { message: 'Keywords removed successfully', data: lecturer };
  }
}
