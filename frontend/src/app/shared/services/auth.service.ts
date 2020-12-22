import { query } from "@angular/animations";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";

import { environment } from "../../../environments/environment";

const JWTS_LOCAL_KEY = "JWTS_LOCAL_KEY";
const JWTS_ACTIVE_INDEX_KEY = "JWTS_ACTIVE_INDEX_KEY";
const CODE = "CODE";

const JWT_ACCESS_TOKEN = "JWT_ACCESS_TOKEN";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  url = environment.auth0.url;
  audience = environment.auth0.audience;
  clientId = environment.auth0.clientId;
  callbackURL = environment.auth0.callbackURL;
  id_token: String;

  jwt_access_token: string;
  decodedJWTAccessToken: any;
  code: string;
  isLoggedIn;
  isLoggedOut;

  constructor(
    public route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  build_login_link(callbackPath = "") {
    let link = "https://";
    link += this.url + ".auth0.com";
    link += "/authorize?";
    link += "audience=" + this.audience + "&";
    link += "response_type=token&";
    link += "client_id=" + this.clientId + "&";
    link += "redirect_uri=" + this.callbackURL + callbackPath + "&";
    link += "scope=openid profile email";
    return link;
  }

  // invoked in app.component on load
  check_token_fragment() {
    this.route.fragment.subscribe((res) => {
      console.log(res);
      if(res) {
        const fragment = res.split('&')[0].split('=')
        // check if the fragment includes the access token
        if (fragment[0] === "access_token") {
          // add the access token to the jwt
          this.jwt_access_token = fragment[1];
          // save jwts to localstore
          this.set_jwt_access_token();
          this.getUserInfo(this.jwt_access_token)
        }
      }
    });
  }

  set_jwt_access_token() {
    localStorage.setItem(JWT_ACCESS_TOKEN, this.jwt_access_token);
    if (this.jwt_access_token) {
      this.decodeJWT(this.jwt_access_token);
    }
  }

  load_jwt_access_token() {
    this.jwt_access_token = localStorage.getItem(JWT_ACCESS_TOKEN) || undefined;

    if (this.jwt_access_token) {
      this.decodeJWT(this.jwt_access_token);
      // this.router.navigate(['/list'])
    }
    return this.jwt_access_token;
  }

  activeJWT() {
    return this.jwt_access_token;
  }

  decodeJWT(token: string) {
    const jwtservice = new JwtHelperService();
    this.decodedJWTAccessToken = jwtservice.decodeToken(token);
    this.isLoggedIn = true;
    this.isLoggedOut = false;
    console.log(this.decodedJWTAccessToken);
    return this.decodedJWTAccessToken;
  }

  logout() {
    this.jwt_access_token = "";
    this.decodedJWTAccessToken = null;
    this.id_token = '';
    localStorage.setItem('ID_TOKEN', '')
    this.set_jwt_access_token();
    this.isLoggedOut = true;
    this.isLoggedIn = false;
  }

  can(permission: string) {
    return (
      this.decodedJWTAccessToken &&
      this.decodedJWTAccessToken.permissions &&
      this.decodedJWTAccessToken.permissions.length &&
      this.decodedJWTAccessToken.permissions.indexOf(permission) >= 0
    );
  }

  getUserInfo(accessToken: string) {
    const url = `http://localhost:5000/userinfo?access_token=${accessToken}`;
    this.http.get(url).subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('ID_TOKEN', JSON.stringify(res.data));
      this.router.navigate(["/list"]);
    });
  }
}
