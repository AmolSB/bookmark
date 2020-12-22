import {Component, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

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
