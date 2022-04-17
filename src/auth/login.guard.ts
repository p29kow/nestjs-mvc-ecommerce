import { ExecutionContext, Injectable } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";

@Injectable()
export class LoginGuard extends LocalAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }
}