import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

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
    this.auth.load_jwt_access_token()
    // if(!this.auth.load_jwt_access_token()) {
      this.auth.check_token_fragment();
    // }
  }

  navigateToHome() {
    this._router.navigate(['']);
  }
}
