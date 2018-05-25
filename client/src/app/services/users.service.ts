import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { AuthenticationService } from './authentication.service';
import { Constants } from '../app.constants';
import { User } from '../models/User';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  private actionUrl: string;

  public constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}user/`;
  }

  public getLoggedInUserCredits() {
    return new HttpGetRequest(this.http, `${this.actionUrl}credits/`, this.authService).getResult();
  }
}
