import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConflictError } from 'helpers/custom-errors';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class CartConflictInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        request.flash('cartSuccess', 'Item was added to your cart');
        response.redirect('/');
      }),
      catchError((error) => {
        if (error instanceof ConflictError) {
          throw new ConflictException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
