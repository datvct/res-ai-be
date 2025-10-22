import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray, IsUUID } from 'class-validator';
import { AcademicTitle } from '../enums/academic-title.enum';

export class CreateLecturerDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Full name of the lecturer',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: AcademicTitle.TS,
    description: 'Academic title',
    enum: AcademicTitle,
  })
  @IsEnum(AcademicTitle)
  @IsNotEmpty()
  academicTitle: AcademicTitle;

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
    example: ['uuid-1', 'uuid-2'],
    description: 'Array of keyword IDs (optional)',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  keywordIds?: string[];
}
