import {Component, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  signUp = true;
  login = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
