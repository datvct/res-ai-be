import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { AcademicDegree } from '../enums/academic-degree.enum';
import { AcademicRank } from '../enums/academic-rank.enum';

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
    example: AcademicDegree.TS,
    description: 'Filter by academic degree (học vị)',
    enum: AcademicDegree,
    required: false,
  })
  @IsEnum(AcademicDegree)
  @IsOptional()
  academicDegree?: AcademicDegree;

  @ApiProperty({
    example: AcademicRank.GS,
    description: 'Filter by academic rank (học hàm)',
    enum: AcademicRank,
    required: false,
  })
  @IsEnum(AcademicRank)
  @IsOptional()
  academicRank?: AcademicRank;
}
