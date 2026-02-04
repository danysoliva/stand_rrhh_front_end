import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { AuthRoutePaths } from '../auth/configurations/auth-route-paths';

import { Alerts } from '../utils/alerts';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private readonly _router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {

                    if ([401,403].indexOf(error.status) !== -1) {
                        Alerts.closeLoad();
                        this._router.navigate([`/auth/login`]);
                    }

                    // let errorMessage = '';
                    // if (error.error instanceof ErrorEvent) {
                    //     // client-side error
                    //     errorMessage = `Error: ${error.error.message}`;
                    // } else {
                    //     // server-side error
                    //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    // }
                    // console.log('Chichan',error);
                    
                    Alerts.showHttpResponse(error);
                    return throwError(error);
                })
            )
    }
}
