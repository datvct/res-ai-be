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
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { multerConfig } from '../common/config/multer.config';
import { LecturersService } from './lecturers.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { SearchLecturerDto } from './dto/search-lecturer.dto';
import { FilterLecturerDto } from './dto/filter-lecturer.dto';
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
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new lecturer with optional image (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['fullName', 'workUnit', 'position'],
      properties: {
        fullName: { type: 'string', example: 'Nguyễn Văn A' },
        academicDegree: {
          type: 'string',
          enum: ['ts', 'ths', 'cn', 'ks', 'ds', 'bs', 'tc', 'khac'],
          example: 'ts',
          description: 'Academic degree (học vị)',
        },
        academicRank: {
          type: 'string',
          enum: ['gs', 'pgs', 'none'],
          example: 'gs',
          description: 'Academic rank (học hàm)',
        },
        workUnit: { type: 'string', example: 'Khoa Công nghệ Thông tin' },
        position: { type: 'string', example: 'Giảng viên chính' },
        website: { type: 'string', example: 'https://lecturer-website.com' },
        keywordIds: { type: 'array', items: { type: 'string' } },
        image: { type: 'string', format: 'binary', description: 'Lecturer image (optional)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Lecturer created successfully' })
  async create(@Body() createLecturerDto: CreateLecturerDto, @UploadedFile() file?: any) {
    const lecturer = await this.lecturersService.create(createLecturerDto, file);
    return { message: 'Lecturer created successfully', data: lecturer };
  }

  @Get()
  @ApiOperation({ summary: 'Get all lecturers with filters' })
  @ApiQuery({
    name: 'fullName',
    required: false,
    description: 'Filter by full name (partial match)',
  })
  @ApiQuery({
    name: 'academicDegree',
    required: false,
    enum: ['ts', 'ths', 'cn', 'ks', 'ds', 'bs', 'tc', 'khac'],
    description: 'Filter by academic degree (học vị)',
  })
  @ApiQuery({
    name: 'academicRank',
    required: false,
    enum: ['gs', 'pgs', 'none'],
    description: 'Filter by academic rank (học hàm)',
  })
  @ApiResponse({ status: 200, description: 'Return filtered lecturers' })
  async findAll(@Query() filterDto: FilterLecturerDto) {
    return await this.lecturersService.findAll(filterDto);
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
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update lecturer by ID with optional new image (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string' },
        academicDegree: {
          type: 'string',
          enum: ['ts', 'ths', 'cn', 'ks', 'ds', 'bs', 'tc', 'khac'],
          description: 'Academic degree (học vị)',
        },
        academicRank: {
          type: 'string',
          enum: ['gs', 'pgs', 'none'],
          description: 'Academic rank (học hàm)',
        },
        workUnit: { type: 'string' },
        position: { type: 'string' },
        website: { type: 'string' },
        keywordIds: { type: 'array', items: { type: 'string' } },
        image: { type: 'string', format: 'binary', description: 'New lecturer image (optional)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Lecturer updated successfully' })
  @ApiResponse({ status: 404, description: 'Lecturer not found' })
  async update(
    @Param('id') id: string,
    @Body() updateLecturerDto: UpdateLecturerDto,
    @UploadedFile() file?: any,
  ) {
    try {
      const lecturer = await this.lecturersService.update(id, updateLecturerDto, file);
      return { message: 'Lecturer updated successfully', data: lecturer };
    } catch (error) {
      throw error;
    }
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
