import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterBlogDto {
  @ApiProperty({
    example: 'Technology',
    description: 'Filter by blog title (partial match)',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'category-uuid',
    description: 'Filter by category ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    example: 'technology',
    description: 'Filter by category slug',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;
}
