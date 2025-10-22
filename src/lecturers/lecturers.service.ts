import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecturer } from './entities/lecturer.entity';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { SearchLecturerDto } from './dto/search-lecturer.dto';
import { KeywordsService } from '../keywords/keywords.service';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(Lecturer)
    private readonly lecturersRepository: Repository<Lecturer>,
    private readonly keywordsService: KeywordsService,
  ) {}

  async create(createLecturerDto: CreateLecturerDto): Promise<Lecturer> {
    const { keywordIds, ...lecturerData } = createLecturerDto;

    const lecturer = this.lecturersRepository.create(lecturerData);

    if (keywordIds && keywordIds.length > 0) {
      const keywords = await this.keywordsService.findByIds(keywordIds);
      lecturer.keywords = keywords;
    }

    return await this.lecturersRepository.save(lecturer);
  }

  async findAll(): Promise<Lecturer[]> {
    return await this.lecturersRepository.find({
      relations: ['keywords', 'publications'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lecturer> {
    const lecturer = await this.lecturersRepository.findOne({
      where: { id },
      relations: ['keywords', 'publications'],
    });

    if (!lecturer) {
      throw new NotFoundException('Lecturer not found');
    }

    return lecturer;
  }

  async search(searchDto: SearchLecturerDto): Promise<Lecturer[]> {
    const query = this.lecturersRepository.createQueryBuilder('lecturer');
    query.leftJoinAndSelect('lecturer.keywords', 'keyword');
    query.leftJoinAndSelect('lecturer.publications', 'publication');

    if (searchDto.search) {
      query.andWhere(
        '(lecturer.fullName LIKE :search OR lecturer.teachingField LIKE :search OR lecturer.researchField LIKE :search)',
        { search: `%${searchDto.search}%` },
      );
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

  async update(id: string, updateLecturerDto: UpdateLecturerDto): Promise<Lecturer> {
    const lecturer = await this.findOne(id);
    const { keywordIds, ...lecturerData } = updateLecturerDto;

    Object.assign(lecturer, lecturerData);

    if (keywordIds !== undefined) {
      if (keywordIds.length > 0) {
        const keywords = await this.keywordsService.findByIds(keywordIds);
        lecturer.keywords = keywords;
      } else {
        lecturer.keywords = [];
      }
    }

    return await this.lecturersRepository.save(lecturer);
  }

  async remove(id: string): Promise<void> {
    const lecturer = await this.findOne(id);
    await this.lecturersRepository.remove(lecturer);
  }

  async addKeywords(id: string, keywordIds: string[]): Promise<Lecturer> {
    const lecturer = await this.findOne(id);
    const keywords = await this.keywordsService.findByIds(keywordIds);

    const existingKeywordIds = lecturer.keywords.map((k) => k.id);
    const newKeywords = keywords.filter((k) => !existingKeywordIds.includes(k.id));

    lecturer.keywords = [...lecturer.keywords, ...newKeywords];

    return await this.lecturersRepository.save(lecturer);
  }

  async removeKeywords(id: string, keywordIds: string[]): Promise<Lecturer> {
    const lecturer = await this.findOne(id);
    lecturer.keywords = lecturer.keywords.filter((k) => !keywordIds.includes(k.id));
    return await this.lecturersRepository.save(lecturer);
  }
}
