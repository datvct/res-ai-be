import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsArray, IsUUID } from 'class-validator';
import { AcademicTitle } from '../enums/academic-title.enum';

export class SearchLecturerDto {
  @ApiProperty({
    example: 'Machine Learning',
    description: 'Search by name, teaching field, or research field',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    example: AcademicTitle.TS,
    description: 'Filter by academic title',
    enum: AcademicTitle,
    required: false,
  })
  @IsEnum(AcademicTitle)
  @IsOptional()
  academicTitle?: AcademicTitle;

  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'Filter by keyword IDs',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  keywordIds?: string[];
}
