import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({
    example: 'menu.education',
    description: 'Unique key for the setting',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: {
      title: { vi: 'Giáo dục', en: 'Education' },
      items: [
        {
          id: 1,
          title: { vi: 'Động lực và hành vi học tập', en: 'Learning Motivation and Behavior' },
          children: [
            { vi: 'Động lực học tập', en: 'Learning motivation' },
            { vi: 'Tự điều chỉnh học tập', en: 'Self-regulated learning' },
          ],
        },
      ],
    },
    description: 'JSON data for the setting',
  })
  @IsOptional()
  value_jsonb?: any;
}
