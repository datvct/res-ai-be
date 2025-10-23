import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class FilterUserDto {
  @ApiProperty({
    example: 'datvct',
    description: 'Filter by username (partial match)',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'Filter by user role',
    enum: UserRole,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
