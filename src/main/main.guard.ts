import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HomeGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (
      request.isAuthenticated() ||
      !request.isAuthenticated()
    ) {      
      return true;
    }
  }
}
