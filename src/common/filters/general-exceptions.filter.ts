import { InternalServerErrorException } from '@nestjs/common';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(HttpException)
export class GeneralExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();

    
    if (exception instanceof ForbiddenException) {
        response.redirect('/');
    }
    if (exception instanceof UnauthorizedException) {
      response.redirect('/auth/signin');
    }
    // if(exception instanceof InternalServerErrorException) {
    //   request.flash('serverError', 'There is a problem with the server. Please try again');
    //   response.redirect('/');
    // }
  }
}
