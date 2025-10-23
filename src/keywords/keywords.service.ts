import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { FilterKeywordDto } from './dto/filter-keyword.dto';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordsRepository: Repository<Keyword>,
  ) {}

  async create(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    const existingKeyword = await this.keywordsRepository.findOne({
      where: { name: createKeywordDto.name },
    });

    if (existingKeyword) {
      throw new ConflictException('Keyword already exists');
    }

    const keyword = this.keywordsRepository.create(createKeywordDto);
    return await this.keywordsRepository.save(keyword);
  }

  async findAll(filterDto?: FilterKeywordDto): Promise<Keyword[]> {
    const queryBuilder = this.keywordsRepository.createQueryBuilder('keyword');

    if (filterDto?.name) {
      queryBuilder.andWhere('keyword.name ILIKE :name', {
        name: `%${filterDto.name}%`,
      });
    }

    queryBuilder.orderBy('keyword.name', 'ASC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Keyword> {
    const keyword = await this.keywordsRepository.findOne({ where: { id } });

    if (!keyword) {
      throw new NotFoundException('Keyword not found');
    }

    return keyword;
  }

  async findByIds(ids: string[]): Promise<Keyword[]> {
    return await this.keywordsRepository.findByIds(ids);
  }

  async getLecturersByKeywordId(keywordId: string): Promise<any> {
    const keyword = await this.keywordsRepository.findOne({
      where: { id: keywordId },
      relations: ['lecturers'],
    });

    if (!keyword) {
      throw new NotFoundException('Keyword not found');
    }

    return {
      keyword: {
        id: keyword.id,
        name: keyword.name,
      },
      lecturers: keyword.lecturers,
      count: keyword.lecturers.length,
    };
  }

  async update(id: string, updateKeywordDto: UpdateKeywordDto): Promise<Keyword> {
    const keyword = await this.findOne(id);

    if (updateKeywordDto.name && updateKeywordDto.name !== keyword.name) {
      const existingKeyword = await this.keywordsRepository.findOne({
        where: { name: updateKeywordDto.name },
      });

      if (existingKeyword) {
        throw new ConflictException('Keyword name already exists');
      }
    }

    Object.assign(keyword, updateKeywordDto);
    return await this.keywordsRepository.save(keyword);
  }

  async remove(id: string): Promise<void> {
    const keyword = await this.findOne(id);
    await this.keywordsRepository.remove(keyword);
  }
}
