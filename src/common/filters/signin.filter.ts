import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class SignInFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        
        if (exception instanceof UnauthorizedException){
            request.flash('loginError', 'Invalid Credentials. Please try again');
            response.redirect('/auth/signin');
        }
    }
}