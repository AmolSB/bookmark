import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HomeModule } from './pages/home/home.module';
import { ListModule } from './pages/list/list.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { SignupButtonComponent } from './components/signup-button/signup-button.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { UserProfileComponent } from './containers/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HomeModule,
    ListModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: 'project-bookmark.us.auth0.com',
      clientId: 'gmdRc7yb4eUpme3tXN2R8r67LVjSVPUw',
      redirectUri: 'http://localhost:4200/list',
      audience: 'http://localhost:5000',
      cacheLocation: 'localstorage',
      response_type: 'token',

      httpInterceptor: {
        allowedList: ['http://localhost:5000/collections', 'http://localhost:5000/links'],
      }
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
