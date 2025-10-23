import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { AcademicTitle } from '../enums/academic-title.enum';

export class FilterLecturerDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Filter by full name (partial match)',
    required: false,
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    example: AcademicTitle.TS,
    description: 'Filter by academic title',
    enum: AcademicTitle,
    required: false,
  })
  @IsEnum(AcademicTitle)
  @IsOptional()
  academicTitle?: AcademicTitle;
}
