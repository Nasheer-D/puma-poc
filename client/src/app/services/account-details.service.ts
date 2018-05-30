import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Constants } from '../app.constants';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountDetailsService {
  private actionUrl: string;
  public constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}account/`;
  }

  public getAllTransactions(userID: string): Observable<any> {
    return new HttpGetRequest(this.http, this.actionUrl + userID, this.authService).getResult();
  }
}
