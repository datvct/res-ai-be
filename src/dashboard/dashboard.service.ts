import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecturer } from '../lecturers/entities/lecturer.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Lecturer)
    private readonly lecturersRepository: Repository<Lecturer>,
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async getStats() {
    // Số lượng giảng viên
    const totalLecturers = await this.lecturersRepository.count();

    // Số lượng bài blog
    const totalBlogs = await this.blogsRepository.count();

    // Số lượng user đăng ký (role là users)
    const totalUsers = await this.usersRepository.count({
      where: { roles: UserRole.USER },
    });

    // Số danh mục bài viết
    const totalCategories = await this.categoriesRepository.count();

    return {
      totalLecturers,
      totalBlogs,
      totalUsers,
      totalCategories,
    };
  }
}
