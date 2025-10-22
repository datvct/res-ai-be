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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('keywords')
@Controller('keywords')
@UseInterceptors(ClassSerializerInterceptor)
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new keyword (Admin only)' })
  @ApiResponse({ status: 201, description: 'Keyword created successfully' })
  async create(@Body() createKeywordDto: CreateKeywordDto) {
    const keyword = await this.keywordsService.create(createKeywordDto);
    return { message: 'Keyword created successfully', data: keyword };
  }

  @Get()
  @ApiOperation({ summary: 'Get all keywords' })
  @ApiResponse({ status: 200, description: 'Return all keywords' })
  async findAll() {
    return await this.keywordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get keyword by ID' })
  @ApiResponse({ status: 200, description: 'Return keyword by ID' })
  @ApiResponse({ status: 404, description: 'Keyword not found' })
  async findOne(@Param('id') id: string) {
    return await this.keywordsService.findOne(id);
  }

  @Get(':id/lecturers')
  @ApiOperation({ summary: 'Get lecturers by keyword ID' })
  @ApiResponse({ status: 200, description: 'Return lecturers with this keyword' })
  @ApiResponse({ status: 404, description: 'Keyword not found' })
  async getLecturersByKeyword(@Param('id') id: string) {
    return await this.keywordsService.getLecturersByKeywordId(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update keyword by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Keyword updated successfully' })
  @ApiResponse({ status: 404, description: 'Keyword not found' })
  async update(@Param('id') id: string, @Body() updateKeywordDto: UpdateKeywordDto) {
    const keyword = await this.keywordsService.update(id, updateKeywordDto);
    return { message: 'Keyword updated successfully', data: keyword };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete keyword by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Keyword deleted successfully' })
  @ApiResponse({ status: 404, description: 'Keyword not found' })
  async remove(@Param('id') id: string) {
    await this.keywordsService.remove(id);
    return { message: 'Keyword deleted successfully' };
  }
}
