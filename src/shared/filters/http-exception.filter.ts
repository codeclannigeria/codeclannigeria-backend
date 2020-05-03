import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '../models/api-exception.model';
import configuration from '../config/configuration';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse() as Response;
    const req = ctx.getRequest();
    const statusCode = error.getStatus();
    const stacktrace =
      configuration().environment === 'production' ? error.stack : null;
    const errorName = error.response.name || error.response.error || error.name;
    const errors = error.response.errors || null;
    const path = req ? req.url : null;

    if (statusCode === HttpStatus.UNAUTHORIZED) {
      if (typeof error.response !== 'string') {
        error.response.message =
          error.response.message ||
          'You do not have permission to access this resource';
      }
    }

    const exception = new ApiException(
      error.response.message,
      errorName,
      stacktrace,
      errors,
      path,
      statusCode,
    );
    res.status(statusCode).json(exception);
  }
}
