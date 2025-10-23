import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepository: Repository<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    // Check if key already exists
    const existingSetting = await this.settingsRepository.findOne({
      where: { key: createSettingDto.key },
    });

    if (existingSetting) {
      throw new ConflictException('Setting key already exists');
    }

    const setting = this.settingsRepository.create(createSettingDto);
    return await this.settingsRepository.save(setting);
  }

  async findAll(): Promise<Setting[]> {
    return await this.settingsRepository.find({
      order: { name: 'ASC', key: 'ASC' },
    });
  }

  async findByKey(key: string): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    return setting;
  }

  async findOne(id: string): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({
      where: { id },
    });

    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    return setting;
  }

  async update(id: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.findOne(id);

    // Check if new key conflicts with existing setting
    if (updateSettingDto.key && updateSettingDto.key !== setting.key) {
      const existingSetting = await this.settingsRepository.findOne({
        where: { key: updateSettingDto.key },
      });

      if (existingSetting) {
        throw new ConflictException('Setting key already exists');
      }
    }

    Object.assign(setting, updateSettingDto);
    return await this.settingsRepository.save(setting);
  }

  async remove(id: string): Promise<void> {
    const setting = await this.findOne(id);
    await this.settingsRepository.remove(setting);
  }

  async updateByKey(key: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.findByKey(key);

    // Check if new key conflicts with existing setting
    if (updateSettingDto.key && updateSettingDto.key !== setting.key) {
      const existingSetting = await this.settingsRepository.findOne({
        where: { key: updateSettingDto.key },
      });

      if (existingSetting) {
        throw new ConflictException('Setting key already exists');
      }
    }

    Object.assign(setting, updateSettingDto);
    return await this.settingsRepository.save(setting);
  }

  async removeByKey(key: string): Promise<void> {
    const setting = await this.findByKey(key);
    await this.settingsRepository.remove(setting);
  }

  async upsert(key: string, value_jsonb: any): Promise<Setting> {
    const existingSetting = await this.settingsRepository.findOne({
      where: { key },
    });

    if (existingSetting) {
      existingSetting.value_jsonb = value_jsonb;
      return await this.settingsRepository.save(existingSetting);
    } else {
      const newSetting = this.settingsRepository.create({ key, value_jsonb });
      return await this.settingsRepository.save(newSetting);
    }
  }
}
