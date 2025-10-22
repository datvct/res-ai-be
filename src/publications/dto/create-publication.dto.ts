import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsUrl,
  IsEnum,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export enum PublicationType {
  RESEARCH_PAPER = 'research_paper',
  PROJECT = 'project',
  BOOK = 'book',
  CONFERENCE = 'conference',
  OTHER = 'other',
}

export class CreatePublicationDto {
  @ApiProperty({
    example: 'Machine Learning in Education',
    description: 'Publication title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A study on applying ML techniques in educational systems',
    description: 'Publication description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 2023,
    description: 'Year of publication',
    required: false,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  publicationYear?: number;

  @ApiProperty({
    example: 'IEEE Transactions',
    description: 'Journal or conference name',
    required: false,
  })
  @IsString()
  @IsOptional()
  journal?: string;

  @ApiProperty({
    example: 'Nguyen Van A, Tran Thi B',
    description: 'List of authors',
    required: false,
  })
  @IsString()
  @IsOptional()
  authors?: string;

  @ApiProperty({
    example: 'https://example.com/paper.pdf',
    description: 'URL to publication',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({
    example: PublicationType.RESEARCH_PAPER,
    description: 'Type of publication',
    enum: PublicationType,
    default: PublicationType.RESEARCH_PAPER,
    required: false,
  })
  @IsEnum(PublicationType)
  @IsOptional()
  type?: PublicationType;

  @ApiProperty({
    example: 'uuid-of-lecturer',
    description: 'Lecturer ID',
  })
  @IsUUID()
  @IsNotEmpty()
  lecturerId: string;
}
