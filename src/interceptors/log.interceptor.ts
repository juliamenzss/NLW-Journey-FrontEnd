import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class LogInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        const dt = Date.now();

        //o handle vai camar o manipulador de rota e o pipe é um tubo que funciona a chamada da execuçao de um codigo depois de ter chamado o handle, 
        return next.handle().pipe(tap(() => {

            const request = context.switchToHttp().getRequest();

            console.log(`URL: ${request.url}`)
            console.log(`METHOD: ${request.method}`)
            console.log(`Duration execution: ${Date.now() - dt} milliseconds`);
            
        }))
    }
}