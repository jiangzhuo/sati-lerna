import { ExecutionContext, Injectable, NestInterceptor, } from '@nestjs/common';
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        call$: Observable<any>,
    ): Observable<any> {
        return call$.pipe(
            catchError(err => {
                console.log(err)
                    if (err instanceof RpcException) {
                        return throwError(err)
                    } else {
                        return throwError(new RpcException({ code: 500, message: err.message }))
                    }
                }
            ),
        );
    }
}
