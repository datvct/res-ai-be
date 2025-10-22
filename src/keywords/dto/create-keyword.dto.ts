import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKeywordDto {
  @ApiProperty({
    example: 'Machine Learning',
    description: 'Keyword name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
