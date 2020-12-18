import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bookmark';

  constructor(private _router: Router, public auth: AuthService) {
  }

  ngOnInit() {

    this.auth.getAccessTokenSilently().subscribe(res => {
      console.log(res)
    })
  }

  navigateToHome() {
    this._router.navigate(['']);
  }
}
