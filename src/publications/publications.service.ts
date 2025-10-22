import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationsRepository: Repository<Publication>,
  ) {}

  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    const publication = this.publicationsRepository.create(createPublicationDto);
    return await this.publicationsRepository.save(publication);
  }

  async findAll(): Promise<Publication[]> {
    return await this.publicationsRepository.find({
      relations: ['lecturer'],
      order: { publicationYear: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByLecturer(lecturerId: string): Promise<Publication[]> {
    return await this.publicationsRepository.find({
      where: { lecturerId },
      order: { publicationYear: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Publication> {
    const publication = await this.publicationsRepository.findOne({
      where: { id },
      relations: ['lecturer'],
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    return publication;
  }

  async update(id: string, updatePublicationDto: UpdatePublicationDto): Promise<Publication> {
    const publication = await this.findOne(id);
    Object.assign(publication, updatePublicationDto);
    return await this.publicationsRepository.save(publication);
  }

  async remove(id: string): Promise<void> {
    const publication = await this.findOne(id);
    await this.publicationsRepository.remove(publication);
  }
}
