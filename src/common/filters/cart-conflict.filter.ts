import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class CartConflictFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        
        if (exception instanceof ConflictException){
            request.flash('cartError', 'This item has already been added to your cart');          
            response.redirect('/');
        }
    }
}