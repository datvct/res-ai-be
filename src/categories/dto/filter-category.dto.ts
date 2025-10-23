import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterCategoryDto {
  @ApiProperty({
    example: 'Technology',
    description: 'Filter by category name (partial match)',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
