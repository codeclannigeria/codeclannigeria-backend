import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiException {
  @ApiProperty()
  statusCode?: number;
  @ApiProperty()
  message?: string;
  @ApiProperty()
  status?: string;
  @ApiProperty()
  error?: string;
  @ApiProperty()
  errors?: any;
  @ApiProperty()
  timestamp?: string;
  @ApiProperty()
  path?: string;
  @ApiProperty()
  stack?: string;

  constructor(
    message: string,
    error: string,
    stack: string,
    errors: any,
    path: string,
    statusCode: number,
  ) {
    this.message = message;
    this.error = error;
    this.stack = stack;
    this.errors = errors;
    this.path = path;
    this.timestamp = new Date().toISOString();
    this.statusCode = statusCode;
    this.status = HttpStatus[statusCode];
  }
}
