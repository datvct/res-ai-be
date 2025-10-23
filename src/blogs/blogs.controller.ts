import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new blog with optional image (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'contents'],
      properties: {
        title: { type: 'string', example: 'Tiêu đề blog' },
        description: { type: 'string', example: 'Mô tả ngắn gọn về blog' },
        contents: { type: 'string', example: 'Nội dung đầy đủ của blog...' },
        categoryId: { type: 'string', example: 'category-uuid' },
        image: { type: 'string', format: 'binary', description: 'Blog image (optional)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
  async create(@Body() createBlogDto: CreateBlogDto, @UploadedFile() file?: any) {
    const blog = await this.blogsService.create(createBlogDto, file);
    return { message: 'Blog created successfully', data: blog };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all blogs with filters',
    description: 'Get all blogs with optional title and category filters',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter by blog title (partial match)',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'slug',
    required: false,
    description: 'Filter by category slug',
  })
  @ApiResponse({
    status: 200,
    description: 'Return filtered blogs',
  })
  async findAll(@Query() filterDto: FilterBlogDto) {
    return await this.blogsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog by ID' })
  @ApiResponse({ status: 200, description: 'Return blog by ID' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async findOne(@Param('id') id: string) {
    return await this.blogsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update blog by ID with optional new image (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        contents: { type: 'string' },
        categoryId: { type: 'string' },
        image: { type: 'string', format: 'binary', description: 'New blog image (optional)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Blog updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file?: any,
  ) {
    const blog = await this.blogsService.update(id, updateBlogDto, file);
    return { message: 'Blog updated successfully', data: blog };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete blog by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async remove(@Param('id') id: string) {
    await this.blogsService.remove(id);
    return { message: 'Blog deleted successfully' };
  }
}
