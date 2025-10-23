import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterKeywordDto {
  @ApiProperty({
    example: 'Machine Learning',
    description: 'Filter by keyword name (partial match)',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
