import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data) => {
        // Nếu data đã là ApiResponse, return luôn
        if (data instanceof ApiResponse) {
          return data;
        }

        // Nếu data có message property, dùng nó
        const message = data?.message || 'Success';

        // Nếu data là object có message, loại bỏ message khỏi data
        if (data && typeof data === 'object' && 'message' in data && !('accessToken' in data)) {
          const { message: msg, ...rest } = data;
          return new ApiResponse(Object.keys(rest).length > 0 ? rest : null, msg, statusCode);
        }

        // Transform data thành ApiResponse format
        return new ApiResponse(data, message, statusCode);
      }),
    );
  }
}
