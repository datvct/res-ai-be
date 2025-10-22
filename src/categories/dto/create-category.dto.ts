import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Công nghệ',
    description: 'Category name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Các bài viết về công nghệ',
    description: 'Category description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'cong-nghe',
    description: 'URL-friendly slug',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;
}
