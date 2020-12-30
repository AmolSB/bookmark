import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { Routes, RouterModule } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { AuthenticationButtonComponent } from 'src/app/containers/authentication-button/authentication-button.component';
import { LoginButtonComponent } from 'src/app/components/login-button/login-button.component';
import { LogoutButtonComponent } from 'src/app/components/logout-button/logout-button.component';
import { SignupButtonComponent } from 'src/app/components/signup-button/signup-button.component';
import {MatDialogModule} from '@angular/material/dialog';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  }
]

@NgModule({
  declarations: [HomeComponent, AuthenticationButtonComponent, LoginButtonComponent, LogoutButtonComponent, SignupButtonComponent],
  imports: [
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
