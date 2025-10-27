import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { AcademicDegree } from '../enums/academic-degree.enum';
import { AcademicRank } from '../enums/academic-rank.enum';

export class CreateLecturerDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Full name of the lecturer',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: AcademicDegree.TS,
    description: 'Academic degree (học vị)',
    enum: AcademicDegree,
    required: false,
  })
  @IsEnum(AcademicDegree)
  @IsOptional()
  academicDegree?: AcademicDegree;

  @ApiProperty({
    example: AcademicRank.GS,
    description: 'Academic rank (học hàm)',
    enum: AcademicRank,
    required: false,
  })
  @IsEnum(AcademicRank)
  @IsOptional()
  academicRank?: AcademicRank;

  @ApiProperty({
    example: 'Khoa Công nghệ Thông tin',
    description: 'Work unit/department',
  })
  @IsString()
  @IsNotEmpty()
  workUnit: string;

  @ApiProperty({
    example: 'Giảng viên chính',
    description: 'Position/title',
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    example: 'https://lecturer-website.com',
    description: 'Personal website or profile link',
    required: false,
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({
    example: 'https://zalo.me/0123456789',
    description: 'Zalo profile link',
    required: false,
  })
  @IsString()
  @IsOptional()
  zalo?: string;

  @ApiProperty({
    example: 'https://m.me/username',
    description: 'Messenger profile link',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    example: 1,
    description: 'Order number for sorting',
    required: false,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === '') return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'Array of keyword IDs (optional)',
    type: [String],
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(',').map((id) => id.trim());
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywordIds?: string[];
}
