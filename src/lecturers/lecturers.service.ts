import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecturer } from './entities/lecturer.entity';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { SearchLecturerDto } from './dto/search-lecturer.dto';
import { FilterLecturerDto } from './dto/filter-lecturer.dto';
import { KeywordsService } from '../keywords/keywords.service';
import { StorageProvider } from '../common/providers/storage.provider';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(Lecturer)
    private readonly lecturersRepository: Repository<Lecturer>,
    private readonly keywordsService: KeywordsService,
    private readonly storageProvider: StorageProvider,
  ) {}

  async create(createLecturerDto: CreateLecturerDto, file?: any): Promise<Lecturer> {
    const { keywordIds, ...lecturerData } = createLecturerDto;

    const lecturer = this.lecturersRepository.create(lecturerData);

    // Initialize keywords as empty array
    lecturer.keywords = [];

    // Upload image if provided and valid
    if (file && file.buffer && file.buffer.length > 0) {
      const imageUrl = await this.storageProvider.uploadMedia(file);
      lecturer.image = imageUrl;
    }

    // Add keywords if provided
    if (keywordIds && keywordIds.length > 0) {
      const keywords = await this.keywordsService.findByIds(keywordIds);
      lecturer.keywords = keywords;
    }

    return await this.lecturersRepository.save(lecturer);
  }

  async findAll(filterDto?: FilterLecturerDto): Promise<Lecturer[]> {
    const queryBuilder = this.lecturersRepository.createQueryBuilder('lecturer');
    queryBuilder.leftJoinAndSelect('lecturer.keywords', 'keyword');

    if (filterDto?.fullName) {
      queryBuilder.andWhere('lecturer.fullName ILIKE :fullName', {
        fullName: `%${filterDto.fullName}%`,
      });
    }

    if (filterDto?.academicDegree) {
      queryBuilder.andWhere('lecturer.academicDegree = :academicDegree', {
        academicDegree: filterDto.academicDegree,
      });
    }

    if (filterDto?.academicRank) {
      queryBuilder.andWhere('lecturer.academicRank = :academicRank', {
        academicRank: filterDto.academicRank,
      });
    }

    queryBuilder.orderBy('lecturer.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Lecturer> {
    const lecturer = await this.lecturersRepository.findOne({
      where: { id },
      relations: ['keywords'],
    });

    if (!lecturer) {
      throw new NotFoundException('Lecturer not found');
    }

    return lecturer;
  }

  async search(searchDto: SearchLecturerDto): Promise<Lecturer[]> {
    const query = this.lecturersRepository.createQueryBuilder('lecturer');
    query.leftJoinAndSelect('lecturer.keywords', 'keyword');

    if (searchDto.search) {
      query.andWhere('(lecturer.fullName LIKE :search)', { search: `%${searchDto.search}%` });
    }

    if (searchDto.academicTitle) {
      query.andWhere('lecturer.academicTitle = :academicTitle', {
        academicTitle: searchDto.academicTitle,
      });
    }

    if (searchDto.keywordIds && searchDto.keywordIds.length > 0) {
      query.andWhere('keyword.id IN (:...keywordIds)', {
        keywordIds: searchDto.keywordIds,
      });
    }

    query.andWhere('lecturer.isActive = :isActive', { isActive: true });

    return await query.getMany();
  }

  async update(id: string, updateLecturerDto: UpdateLecturerDto, file?: any): Promise<Lecturer> {
    const lecturer = await this.findOne(id);
    const { keywordIds, ...lecturerData } = updateLecturerDto;

    // Update lecturer data
    Object.assign(lecturer, lecturerData);

    // Upload new image if provided and valid
    if (file && file.buffer && file.buffer.length > 0) {
      // Delete old image if exists
      if (lecturer.image) {
        await this.storageProvider.deleteMedia(lecturer.image);
      }
      const imageUrl = await this.storageProvider.uploadMedia(file);
      lecturer.image = imageUrl;
    } else if (file) {
    }

    // Update keywords only if keywordIds is provided
    if (keywordIds !== undefined) {
      if (keywordIds && keywordIds.length > 0) {
        const keywords = await this.keywordsService.findByIds(keywordIds);
        lecturer.keywords = keywords;
      } else {
        // Clear all keywords if empty array is provided
        lecturer.keywords = [];
      }
    }
    // If keywordIds is undefined, keep existing keywords

    const saved = await this.lecturersRepository.save(lecturer);

    return saved;
  }

  async remove(id: string): Promise<void> {
    const lecturer = await this.findOne(id);

    // Delete image if exists
    if (lecturer.image) {
      await this.storageProvider.deleteMedia(lecturer.image);
    }

    await this.lecturersRepository.remove(lecturer);
  }

  async addKeywords(id: string, keywordIds: string[]): Promise<Lecturer> {
    const lecturer = await this.findOne(id);

    // Ensure keywords array exists
    if (!lecturer.keywords) {
      lecturer.keywords = [];
    }

    const keywords = await this.keywordsService.findByIds(keywordIds);

    const existingKeywordIds = lecturer.keywords.map((k) => k.id);
    const newKeywords = keywords.filter((k) => !existingKeywordIds.includes(k.id));

    lecturer.keywords = [...lecturer.keywords, ...newKeywords];

    return await this.lecturersRepository.save(lecturer);
  }

  async removeKeywords(id: string, keywordIds: string[]): Promise<Lecturer> {
    const lecturer = await this.findOne(id);

    // Ensure keywords array exists
    if (!lecturer.keywords) {
      lecturer.keywords = [];
    }

    lecturer.keywords = lecturer.keywords.filter((k) => !keywordIds.includes(k.id));
    return await this.lecturersRepository.save(lecturer);
  }
}
