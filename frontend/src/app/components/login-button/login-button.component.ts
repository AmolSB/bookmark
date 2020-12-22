import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {

  constructor(public auth: AuthService) { }

  loginLink;

  ngOnInit(): void {
    this.loginLink = this.auth.build_login_link();
  }


  loginWithRedirect() {

  //   this.auth.loginWithPopup().subscribe(res => {
  //     console.log(res);
  //     console.log("logged in");

    }

}
