import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent implements OnInit {

  constructor(public auth: AuthService, @Inject(DOCUMENT) private doc: Document) { }

  ngOnInit(): void {
  }

  logout(): void {
    console.log(this.doc.location);

    console.log(this.doc.location.origin)
    this.auth.logout({ returnTo:  'http://localhost:4200'});
  }

}
