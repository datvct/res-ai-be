import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UploadBase64Dto {
  @ApiProperty({
    example: ['data:image/png;base64,iVBORw0KGgo...'],
    description: 'Array of base64 image strings',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
