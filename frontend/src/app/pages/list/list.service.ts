import { query } from "@angular/animations";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn:'root',
})
export class ListService {

  apiBase = environment.apiBase;

  constructor(private _http: HttpClient) {

  }

  getCollections() {
    const url = `${this.apiBase}collections`;
    return this._http.get(url)
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
    return this._http.post(url, payload)
  }

  addNewCollection(payload) {
    const url = `${this.apiBase}collections`
    return this._http.post(url, payload)
  }
}
