import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty()
  data: T;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: Date;

  constructor(data: T, message: string = 'Success', statusCode: number = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date();
  }
}
