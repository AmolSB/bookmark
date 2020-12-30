import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('whatIsIt') whatIsItTemplateRef;

  signUp = true;
  login = false;

  constructor(private _router: Router, private route: ActivatedRoute, public authService: AuthService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  showPublicCollections() {
    this._router.navigate(['/list'], {queryParams: {publicCollections: true}})
  }

  showMyCollections() {
    this._router.navigate(['/lists'])
  }

  openWhatIsItDialog() {
    this.dialog.open(this.whatIsItTemplateRef)
  }

}
