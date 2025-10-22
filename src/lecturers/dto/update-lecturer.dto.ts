import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLecturerDto } from './create-lecturer.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLecturerDto extends PartialType(CreateLecturerDto) {
  @ApiProperty({
    example: true,
    description: 'Active status',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
