import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { InternalServerError } from "helpers/custom-errors";
import { catchError, Observable } from "rxjs";

@Injectable()
export class InternalServerErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {        
        return next.handle()
        .pipe(catchError(error => {
            if(error instanceof InternalServerError) {
                throw new InternalServerErrorException(error.message);
            } else {
                throw error;
            }

        }))
    }
}