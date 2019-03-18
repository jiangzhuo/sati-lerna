import * as Sentry from '@sentry/node';
import { ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    private logger = new Logger('Interceptor');

    intercept(context: ExecutionContext, calls$: Observable<any>): Observable<any> {
        return calls$.pipe(catchError((error) => {
            // console.log(error)
            // console.log(111111111111111)
            let code,message;
            if (error instanceof HttpException) {
                code = error.getStatus();
                message = error.getResponse();
                this.logger.error(`${code}\t${message}`);
                // return throwError(error)
            } else if (error.code) {
                code = error.code;
                message = error.message || error.details || JSON.stringify(error.data) || '';
                this.logger.error(`${code}\t${message}`);
                // return throwError(new HttpException(message, code))
            } else {
                // Sentry.captureException(error);
                code = 500;
                message = error.message || 'unknow error';
                this.logger.error(`${code}\t${message}`);
                return throwError(new HttpException(message, code))
            }
            return Promise.resolve({
                code,
                message,
            });
        }));
    }
}
