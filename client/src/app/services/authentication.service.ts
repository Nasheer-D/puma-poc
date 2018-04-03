import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../app.constants';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { HttpResponse } from '../utils/web/models/HttpResponse';
import { User } from '../models/User';

export const TOKEN_KEY: string = 'jwt_token';
export const USER_KEY: string = 'currentUser';

@Injectable()
export class AuthenticationService {
  public actionUrl: string;
  public token: string;
  public user: any;
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  public constructor(private _http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}login`;
    // set token if saved in local storage
    this.token = this.getToken();
  }

  public login(username: string, password: string): Observable<any> {
    return this._http.post(this.actionUrl, { username: username, password: password }, {headers: this.headers})
    .pipe(
      map((response: HttpResponse) => {
        console.log('response', response);
        if (!response.success) {
          return false;
        }

        const user: User = response.user;
        const token: string = response.token;
        if (!token) {
          return false; // Login unsuccessful if there's no token in the response
        }
        this.token = token;

        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(TOKEN_KEY, JSON.stringify({ token }));
        localStorage.setItem(USER_KEY, JSON.stringify({ user }));

        return true;
      })
    );
  }

  // clear token and remove user from local storage to log user out
  public logout(): void {
    this.token = null;
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  public createAuthorizationHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('x-access-token', this.getToken());
    headers = headers.append('Content-Type', 'application/json');

    return headers;
  }

  public getToken(): string {
    const userToken = JSON.parse(localStorage.getItem(TOKEN_KEY));

    return userToken ? userToken.token : null;
  }

  private getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  public isTokenExpired(token?: string): boolean {
    if (!token) { token = this.getToken(); }
    if (!token) { return true; }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) { return false; }

    return !(date.valueOf() > new Date().valueOf());
  }
}
