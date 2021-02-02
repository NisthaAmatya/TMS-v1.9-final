import { browser } from 'protractor';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { WebRequestService } from './web-request.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private webService: WebRequestService, private router: Router, private http: HttpClient) { }

login(username: string, password: string) {
  return this.webService.login(username, password).pipe(
    shareReplay(),
    tap((res: HttpResponse<any>) => {
      //the auth tokens will be in the header of this response
      this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      console.log("Logged in");

    })
    // do not want multiple subscribers
  )
}

logout(){
  this.removeSession();
  this.router.navigate(['/login']);
}

getAccessToken(){
  return localStorage.getItem('x-access-token');
}

getRefreshToken(){
  //console.log('I am in getRefreshToken through getNewAccessToken!!!')
  //return localStorage.getItem('x-refresh-token');
  let msg = localStorage.getItem('x-refresh-token');
  //console.log(msg);
  return msg;
}

getUserId() {
  let msg = localStorage.getItem('user-id');
  //console.log(msg);
  return msg;
}


setAccessToken(accessToken: string){
  localStorage.setItem('x-access-token', accessToken);
}

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refreshToken');
  }


  getNewAccessToken() {
    //console.log('I am in getNewAccessToken!!!')
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId(),
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token'));
        //console.log('I AM IN getNewAccessToken!!!');
      })
    )
  }

}
