import { AuthService } from './auth.service';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { empty, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }
  refreshingAccessToken: boolean;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    //Handle request.
    request = this.addAuthHeader(request);
    //Call next() and handle request.
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse)=> {
        //console.log(error);
        if (error.status === 401 && !this.refreshingAccessToken)
        {
          //401 error, meaning user is unauthorized.
          //refresh access token.
          //console.log('I AM HERE!!!')
          return this.refreshAccessToken()
          .pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              console.log(err);
              this.authService.logout();
              return empty();
            })
          )
          //console.log('test');
        }
        return throwError(error);
      })
    )

  }

  refreshAccessToken() {
    this.refreshingAccessToken = true;
    //Call method in auth service to send request to refresh access token.
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        this.refreshingAccessToken = false;
        console.log('Access Token Refreshed!!!');
      })
    )
  }

  addAuthHeader(request: HttpRequest<any>){
    //get access token and add header containing the access token to the http
    const token = this.authService.getAccessToken();
    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request ;
    //append access token to request header
  }


}
