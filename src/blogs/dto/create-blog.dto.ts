import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Tiêu đề blog',
    description: 'Blog title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Mô tả ngắn gọn về blog',
    description: 'Blog description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Nội dung đầy đủ của blog...',
    description: 'Blog contents (HTML or Markdown)',
  })
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty({
    example: 'category-uuid',
    description: 'Category ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
