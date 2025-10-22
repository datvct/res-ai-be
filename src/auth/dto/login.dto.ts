import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
