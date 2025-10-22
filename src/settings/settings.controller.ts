import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new setting (Admin only)' })
  @ApiResponse({ status: 201, description: 'Setting created successfully' })
  async create(@Body() createSettingDto: CreateSettingDto) {
    const setting = await this.settingsService.create(createSettingDto);
    return { message: 'Setting created successfully', data: setting };
  }

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'Return all settings' })
  async findAll() {
    return await this.settingsService.findAll();
  }

  @Get('by-key/:key')
  @ApiOperation({ summary: 'Get setting by key' })
  @ApiResponse({ status: 200, description: 'Return setting by key' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async findByKey(@Param('key') key: string) {
    return await this.settingsService.findByKey(key);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get setting by ID' })
  @ApiResponse({ status: 200, description: 'Return setting by ID' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async findOne(@Param('id') id: string) {
    return await this.settingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update setting by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    const setting = await this.settingsService.update(id, updateSettingDto);
    return { message: 'Setting updated successfully', data: setting };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete setting by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Setting deleted successfully' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async remove(@Param('id') id: string) {
    await this.settingsService.remove(id);
    return { message: 'Setting deleted successfully' };
  }
}
