import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

    }

    onLoginButtonClicked(username: string, password: string) {
      this.authService.login(username, password).subscribe((res: HttpResponse<any>) => {
        //console.log(res);
        this.router.navigate(['/workspaces']);
      })
    }

    onKeydown(event, username: string, password: string) {
      console.log(event);
      this.onLoginButtonClicked(username, password)
    }


  }


