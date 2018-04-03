import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Constants } from '../app.constants';
import { AuthenticationService } from './authentication.service';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { User } from '../models/User';

@Injectable()
export class ThingService {
  private actionUrl: string;

  public constructor(private http: HttpClient,
    private authService: AuthenticationService) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}things`;
  }

  public getAllThings() {
    const user: User = JSON.parse(localStorage.getItem('currentUser')).user;

    return new HttpGetRequest(this.http, this.actionUrl, this.authService).getResult();
  }

  public getThingByID(thingID: string) {
    const user: User = JSON.parse(localStorage.getItem('currentUser')).user;

    return new HttpGetRequest(this.http, this.actionUrl + `/${thingID}`, this.authService).getResult();
  }
}
