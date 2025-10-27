import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { StorageProvider } from '../common/providers/storage.provider';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    private readonly storageProvider: StorageProvider,
  ) {}

  async create(createBlogDto: CreateBlogDto, file?: any): Promise<Blog> {
    const blog = this.blogsRepository.create(createBlogDto);

    // Upload image if provided and valid
    if (file && file.buffer && file.buffer.length > 0) {
      const imageUrl = await this.storageProvider.uploadMedia(file);
      blog.image = imageUrl;
    }

    return await this.blogsRepository.save(blog);
  }

  async findAll(filterDto?: FilterBlogDto): Promise<Blog[]> {
    const queryBuilder = this.blogsRepository.createQueryBuilder('blog');
    queryBuilder.leftJoinAndSelect('blog.category', 'category');

    queryBuilder.where('blog.isActive = :isActive', { isActive: true });

    if (filterDto?.title) {
      queryBuilder.andWhere('blog.title ILIKE :title', {
        title: `%${filterDto.title}%`,
      });
    }

    if (filterDto?.categoryId) {
      queryBuilder.andWhere('blog.categoryId = :categoryId', {
        categoryId: filterDto.categoryId,
      });
    }

    if (filterDto?.slug) {
      queryBuilder.andWhere('category.slug = :slug', {
        slug: filterDto.slug,
      });
    }

    queryBuilder.orderBy('blog.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

  async findByCategory(categoryId: string): Promise<Blog[]> {
    return await this.blogsRepository.find({
      where: { categoryId, isActive: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, file?: any): Promise<Blog> {
    const blog = await this.findOne(id);

    Object.assign(blog, updateBlogDto);

    // Force update categoryId nếu có trong DTO
    if (updateBlogDto.categoryId) {
      blog.categoryId = updateBlogDto.categoryId;
      blog.category = undefined; // Clear relation để force reload
    }

    // Upload new image if provided and valid
    if (file && file.buffer && file.buffer.length > 0) {
      // Delete old image if exists
      if (blog.image) {
        await this.storageProvider.deleteMedia(blog.image);
      }
      const imageUrl = await this.storageProvider.uploadMedia(file);
      blog.image = imageUrl;
    }

    await this.blogsRepository.save(blog);

    // Reload relation để lấy category mới
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const blog = await this.findOne(id);

    // Delete image if exists
    if (blog.image) {
      await this.storageProvider.deleteMedia(blog.image);
    }

    await this.blogsRepository.remove(blog);
  }
}
