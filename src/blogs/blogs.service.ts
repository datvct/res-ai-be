import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
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

  async findAll(): Promise<Blog[]> {
    return await this.blogsRepository.find({
      where: { isActive: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
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

    // Upload new image if provided and valid
    if (file && file.buffer && file.buffer.length > 0) {
      // Delete old image if exists
      if (blog.image) {
        await this.storageProvider.deleteMedia(blog.image);
      }
      const imageUrl = await this.storageProvider.uploadMedia(file);
      blog.image = imageUrl;
    }

    return await this.blogsRepository.save(blog);
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
