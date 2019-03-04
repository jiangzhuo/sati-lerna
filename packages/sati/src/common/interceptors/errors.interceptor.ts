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
                return throwError(error)
            } else if (error.code) {
                code = error.code;
                message = error.message || error.details || JSON.stringify(error.data) || '';
                this.logger.error(`${code}\t${message}`);
                return throwError(new HttpException(message, code))
            } else {
                // Sentry.captureException(error);
                code = 500;
                message = error.message || 'unknow error';
                this.logger.error(`${code}\t${message}`);
                return throwError(new HttpException(message, code))
            }

            // this.logger.error(`${code}\t${message}`);
            // return throwError(new HttpException(message, code))
            // return throwError({
            //         code,
            //         message,
            //     })

            // return Promise.resolve({
            //     statusCode:code,
            //     message,
            // });

            // if (error instanceof HttpException) {
            //     const code = error.getStatus();
            //     const message = error.getResponse();
            //     console.log(11111111)
            //     this.logger.error(`${code}\t${message}`);
            //     return Promise.resolve({
            //         code,
            //         message,
            //     });
            // } else if (error.code) {
            //     const code = error.code;
            //     const message = error.message || error.details || JSON.stringify(error.data) || '';
            //     console.log(22222222)
            //     this.logger.error(`${code}\t${message}`);
            //     return Promise.resolve({
            //         code,
            //         message,
            //     });
            // } else {
            //     Sentry.captureException(error);
            //     const code = 500;
            //     const message = error.message || 'unknow error';
            //     console.log(33333333333)
            //     this.logger.error(`${code}\t${message}`);
            //     return Promise.resolve({
            //         code,
            //         message,
            //     });
            //     // return throwError(new HttpException(message, HttpStatus.FORBIDDEN));
            // }
        }));
    }
}

// import {
//     Injectable,
//     NestInterceptor,
//     ExecutionContext,
//     HttpStatus,
// } from '@nestjs/common';
// import { HttpException } from '@nestjs/common';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
//
// @Injectable()
// export class ErrorsInterceptor implements NestInterceptor {
//     intercept(
//         context: ExecutionContext,
//         call$: Observable<any>,
//     ): Observable<any> {
//         return call$.pipe(
//             catchError(err => {
//                     console.trace(err)
//                     return throwError(new HttpException('Message', HttpStatus.BAD_GATEWAY))
//                 }
//             ),
//         );
//     }
// }
