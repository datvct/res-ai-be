import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEmail,
  IsArray,
  IsUUID,
} from 'class-validator';
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
    example: 1980,
    description: 'Birth year',
  })
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  birthYear: number;

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
    example: 'Lập trình Web, Cơ sở dữ liệu',
    description: 'Teaching fields',
  })
  @IsString()
  @IsNotEmpty()
  teachingField: string;

  @ApiProperty({
    example: 'Machine Learning, AI, Data Science',
    description: 'Research fields',
  })
  @IsString()
  @IsNotEmpty()
  researchField: string;

  @ApiProperty({
    example: 'lecturer@university.edu.vn',
    description: 'Email address',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'Bio mô tả về giảng viên',
    description: 'Biography',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'Array of keyword IDs',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  keywordIds?: string[];
}
