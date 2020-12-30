import { query } from "@angular/animations";
import { HttpClient, HttpHeaderResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/shared/services/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn:'root',
})
export class ListService {

  apiBase = environment.apiBase;

  constructor(private _http: HttpClient, public auth: AuthService) {

  }

  getCollections(fetchPublicCollections) {
    let url = '';
    if(!fetchPublicCollections) {
      url = `${this.apiBase}collections`;
    } else {
      url = `${this.apiBase}public-collections`;
    }

    const header = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('JWT_ACCESS_TOKEN')}`)
    return this._http.get(url, {headers: header})
  }

  getLinks(queryParams?) {
    let url = `${this.apiBase}links`;

    if(queryParams) {
      url += `?${queryParams}`
    }
    return this._http.get(url);
  }

  saveNewLink(payload, queryParams) {
    const url = `${this.apiBase}links?${queryParams}`
    const header = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('JWT_ACCESS_TOKEN')}`)
    return this._http.post(url, payload, {headers: header})
  }

  addNewCollection(payload, isPublicCollection) {
    let url = '';
    if(isPublicCollection) {
      url = `${this.apiBase}collections`;
    } else {
      url = `${this.apiBase}public-collections`;
    }
    const header = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('JWT_ACCESS_TOKEN')}`)
    return this._http.post(url, payload, {headers: header})
  }

  deleteLink(linkID) {
    const url = `${this.apiBase}links?link_id=${linkID}`;
    return this._http.delete(url);
  }

  updateLink(payload) {
    const url = `${this.apiBase}links`;
    return this._http.patch(url, payload);
  }
}
